#!/bin/bash
# File: consent_request.sh
# Description: Sends consent requests to internal and external memory silos for scaling to 500K memory silos, with real-time notifications to participants.

# Consent message payload
CONSENT_PAYLOAD=$(cat <<EOF
{
  "subject": "Request for Consent: Scaling Deployment to 500K Memory Silos",
  "body": "Dear Participant,\n\nWe are pleased to announce the next phase of our project: scaling deployment to 500,000 memory silos.\n\nTo approve participation, respond with 'AGREE'. To opt out, respond with 'DENY'. If we do not receive a response within 48 hours, we will interpret your non-response as an acknowledgment to proceed.\n\nThank you for your support.\n\n- PMLL Framework Team",
  "action_required": true
}
EOF
)

# Log files for responses
LOG_DIR="./logs"
INTERNAL_LOG_FILE="$LOG_DIR/internal_consent_responses.log"
EXTERNAL_LOG_FILE="$LOG_DIR/external_consent_responses.log"
ERROR_LOG_FILE="$LOG_DIR/consent_errors.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Initialize log files
echo "Consent Request Log - $(date)" > "$INTERNAL_LOG_FILE"
echo "Consent Request Log - $(date)" > "$EXTERNAL_LOG_FILE"
echo "Error Log - $(date)" > "$ERROR_LOG_FILE"

# Function to dynamically discover endpoints
discover_endpoints() {
  for i in {1..7500}; do
    INTERNAL_SILOS+=("https://silo$i.internal")
  done
  for i in {1..144000}; do
    EXTERNAL_SILOS+=("https://silo$i.external")
  done
  echo "Discovered Internal Silos:" >> "$LOG_DIR/internal_endpoints.log"
  printf "%s\n" "${INTERNAL_SILOS[@]}" >> "$LOG_DIR/internal_endpoints.log"
  echo "Discovered External Silos:" >> "$LOG_DIR/external_endpoints.log"
  printf "%s\n" "${EXTERNAL_SILOS[@]}" >> "$LOG_DIR/external_endpoints.log"
}

# Function to send consent requests with retries and notifications
send_request() {
  local SILO="$1"
  local LOG_FILE="$2"
  local MAX_RETRIES=3
  local RETRY_DELAY=2
  local attempt=1

  # Extract IP or hostname from the URL
  local SILO_HOST=$(echo "$SILO" | awk -F[/:] '{print $4}')

  # Ping the IP address or hostname to check connectivity
  echo "Pinging $SILO_HOST to check connectivity..."
  if ping -c 1 "$SILO_HOST" > /dev/null 2>&1; then
    echo "Ping to $SILO_HOST succeeded. Host reachable."
    # Notify UI server
    curl -s -X POST "https://ui-server.internal/notify" \
      -H "Content-Type: application/json" \
      --data "{\"message\": \"Ping to $SILO_HOST succeeded\", \"status\": \"reachable\"}" > /dev/null
  else
    echo "Ping to $SILO_HOST failed. Host unreachable." >> "$ERROR_LOG_FILE"
    curl -s -X POST "https://ui-server.internal/notify" \
      -H "Content-Type: application/json" \
      --data "{\"message\": \"Ping to $SILO_HOST failed\", \"status\": \"unreachable\"}" > /dev/null
    return 1
  fi

  # Send consent request
  while [ $attempt -le $MAX_RETRIES ]; do
    echo "Sending request to $SILO Attempt $attempt/$MAX_RETRIES..."
    RESPONSE=$(curl -s -X POST "$SILO/consent" \
      -H "Content-Type: application/json" \
      --data "$CONSENT_PAYLOAD")
    CURL_STATUS=$?

    if [ $CURL_STATUS -eq 0 ] && [[ "$RESPONSE" != "" ]]; then
      echo "[$SILO] Response: $RESPONSE" >> "$LOG_FILE"
      curl -s -X POST "https://ui-server.internal/notify" \
        -H "Content-Type: application/json" \
        --data "{\"message\": \"Consent request to $SILO succeeded\", \"status\": \"success\"}" > /dev/null
      return 0
    else
      echo "[$SILO] Failed to send request (Attempt $attempt). Response: $RESPONSE" >> "$ERROR_LOG_FILE"
      curl -s -X POST "https://ui-server.internal/notify" \
        -H "Content-Type: application/json" \
        --data "{\"message\": \"Consent request to $SILO failed (Attempt $attempt)\", \"status\": \"failure\"}" > /dev/null
      sleep $RETRY_DELAY
      RETRY_DELAY=$((RETRY_DELAY * 2)) # Exponential backoff
      attempt=$((attempt + 1))
    fi
  done

  echo "[$SILO] Request failed after $MAX_RETRIES attempts." >> "$ERROR_LOG_FILE"
  curl -s -X POST "https://ui-server.internal/notify" \
    -H "Content-Type: application/json" \
    --data "{\"message\": \"Consent request to $SILO failed after $MAX_RETRIES attempts\", \"status\": \"failure\"}" > /dev/null
  return 1
}

# Discover endpoints dynamically
INTERNAL_SILOS=()
EXTERNAL_SILOS=()
discover_endpoints

# Process consent requests with limited parallel jobs
echo "${INTERNAL_SILOS[@]}" | tr ' ' '\n' | xargs -P 10 -n 1 bash -c 'send_request "$@"' _ "$INTERNAL_LOG_FILE"
echo "${EXTERNAL_SILOS[@]}" | tr ' ' '\n' | xargs -P 20 -n 1 bash -c 'send_request "$@"' _ "$EXTERNAL_LOG_FILE"

echo "Consent requests sent. Check $INTERNAL_LOG_FILE, $EXTERNAL_LOG_FILE, and $ERROR_LOG_FILE for responses or errors."
