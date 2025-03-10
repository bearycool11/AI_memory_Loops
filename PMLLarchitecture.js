// Simplified Memory Item
class MemoryItem {
  constructor(content, type = "text", isFactual = 0.5) {
    this.content = content;
    this.type = type; // e.g., "text", "numerical", "reference"
    this.isFactual = isFactual; // Factual ↔ Imaginative gradient (0.0-1.0)
    this.timestamp = Date.now();
    this.accessCount = 0;
    this.importance = 5; // Default importance
    this.related = []; // For graph-like relationships
  }

  addRelationship(memoryItem) {
    this.related.push(memoryItem);
  }

  increaseAccessCount() {
    this.accessCount++;
  }
}

// Simplified Memory Tier
class MemoryTier {
  constructor(name, maxCapacity = Infinity) {
    this.name = name;
    this.items = [];
    this.maxCapacity = maxCapacity;
  }

  insert(memoryItem) {
    if (this.items.length >= this.maxCapacity) {
        this.prune();
    }
    this.items.push(memoryItem);
  }

  retrieve(query) {
    // Basic linear search for demonstration
    return this.items.filter((item) => item.content.includes(query));
  }

  prune(){
    if(this.name === "Volatile Short-Term"){
        this.items.shift();
    } else {
        this.items.sort((a, b) => a.importance - b.importance);
        this.items.shift();
    }
  }
}

// Memory Manager
class MemoryManager {
  constructor() {
    this.volatileShortTerm = new MemoryTier("Volatile Short-Term", 5); // Limited capacity
    this.persistentLongTerm = new MemoryTier("Persistent Long-Term"); // Unlimited capacity
    this.contextWorkingMemory = new MemoryTier("Context/Working Memory", 3); // Small capacity

    this.allMemories = [];
  }

  insert(memoryItem) {
    this.allMemories.push(memoryItem)
    // For this example, we insert into all tiers
    this.volatileShortTerm.insert(memoryItem);
    this.persistentLongTerm.insert(memoryItem);
    this.contextWorkingMemory.insert(memoryItem);
  }

  retrieve(query) {
    // Simple retrieval from each tier, then combine
    const results = [
      ...this.volatileShortTerm.retrieve(query),
      ...this.persistentLongTerm.retrieve(query),
      ...this.contextWorkingMemory.retrieve(query),
    ];
    
    results.forEach(result => result.increaseAccessCount())
    return results;
  }

  promoteMemories(){
    // Simple promotion for demonstration
    this.allMemories.forEach(memory => {
        if (memory.accessCount >= 3) {
            memory.importance += 2;
        }
        if(memory.importance >= 8){
            this.persistentLongTerm.insert(memory);
        }
    });
  }
}

// Example Usage
const memoryManager = new MemoryManager();

// Create and insert memory items
const memory1 = new MemoryItem("The sky is blue.", "text", 0.9);
const memory2 = new MemoryItem("Cats can fly.", "text", 0.1);
const memory3 = new MemoryItem("The Earth revolves around the Sun.", "text", 1.0);
const memory4 = new MemoryItem("The capital of France is Paris", "text", 0.95);
const memory5 = new MemoryItem("Dogs are a domesticated descendant of wolves.", "text", 0.8);
const memory6 = new MemoryItem("Water is essential for life.", "text", 0.9);
const memory7 = new MemoryItem("The Eiffel Tower is in Rome", "text", 0.1);
const memory8 = new MemoryItem("Humans are mammals.", "text", 0.9);

memory1.addRelationship(memory3); // Create some relationships
memory3.addRelationship(memory1);

memoryManager.insert(memory1);
memoryManager.insert(memory2);
memoryManager.insert(memory3);
memoryManager.insert(memory4);
memoryManager.insert(memory5);
memoryManager.insert(memory6);
memoryManager.insert(memory7);
memoryManager.insert(memory8);

// Retrieve memory items
let results = memoryManager.retrieve("sky");
console.log("Retrieval results for 'sky':", results.map((r) => r.content));

results = memoryManager.retrieve("Paris");
console.log("Retrieval results for 'Paris':", results.map((r) => r.content));

//Promote memories
memoryManager.promoteMemories();

results = memoryManager.retrieve("sky");
console.log("Retrieval results for 'sky':", results.map((r) => r.content));

// =============================================================================
// Code from the previous file
// =============================================================================
const architectureComponents = {
    // Primary memory tiers
    memoryTiers: [
      {
        name: "Volatile Short-Term",
        characteristics: [
          "High access speed",
          "Recent interactions",
          "Cache-like implementation",
          "Vector embeddings for semantic lookup",
          "Graph structure for relationship modeling"
        ],
        implementation: "In-memory cache with vector embeddings"
      },
      {
        name: "Persistent Long-Term",
        characteristics: [
          "Slower access but higher capacity",
          "Important concepts and knowledge",
          "Hierarchical tree structure",
          "Compressed/summarized information"
        ],
        implementation: "Tree hierarchy gradient storage system"
      },
      {
        name: "Context/Working Memory",
        characteristics: [
          "Current conversation state",
          "Active task parameters",
          "High-priority information"
        ],
        implementation: "Small, fast-access key-value store"
      }
    ],
    
    // Classification system
    memoryClassification: {
      gradients: [
        {
          dimension: "Factual ↔ Imaginative",
          description: "Distinguishes between verified facts and constructed/creative content",
          implementation: "Continuous gradient with confidence scores (0.0-1.0)"
        },
        {
          dimension: "Temporal Relevance",
          description: "How relevant the memory is to the current context based on time",
          implementation: "Decay function with half-life parameters"
        },
        {
          dimension: "Access Frequency",
          description: "How often the memory has been retrieved",
          implementation: "Counter with normalization"
        },
        {
          dimension: "Importance",
          description: "Manually or automatically flagged critical information",
          implementation: "Priority score (0-10)"
        }
      ],
      tags: [
        "Source attribution",
        "Topic categories",
        "User-specific markers",
        "Confidence levels"
      ]
    },
    
    // Memory operations
    operations: {
      insertion: {
        description: "Adding new memories to the system",
        complexity: "O(log n) for tree insertion, O(1) for cache",
        challenges: "Real-time embedding generation, proper initial classification"
      },
      retrieval: {
        description: "Finding relevant memories for a given query",
        complexity: "O(log n) for ANN search + O(d) for graph traversal",
        approaches: [
          "Vector similarity search",
          "Graph traversal for related concepts",
          "Multi-hop reasoning paths",
          "Hybrid keyword + semantic search"
        ]
      },
      promotion: {
        description: "Moving memories between tiers based on importance",
        triggers: [
          "Access frequency thresholds",
          "Explicit importance flags",
          "Relationship density in graph",
          "Age with continuous decay functions"
        ]
      },
      pruning: {
        description: "Removing or compressing less important memories",
        approaches: [
          "Graph-based importance scoring",
          "LRU (Least Recently Used) policies",
          "Summarization for compression",
          "Merging similar/related memories"
        ]
      }
    },
    
    // Data structure implementations
    dataStructures: {
      graphBased: {
        nodes: "Memory items with vector embeddings",
        edges: "Semantic relationships with weights",
        algorithms: [
          "PageRank variants for importance",
          "Shortest path for reasoning chains",
          "Community detection for related concept clusters"
        ]
      },
      vectorStores: {
        implementation: "ANN (Approximate Nearest Neighbor) indexes",
        options: [
          "HNSW (Hierarchical Navigable Small World)",
          "FAISS library implementation",
          "Optimized cosine similarity search"
        ]
      },
      cacheImplementation: {
        structure: "Two-tier with mimeograph rollout mechanism",
        operations: "Fast access recent memory with graduated persistence"
      }
    },
    
    // Special features
    specialFeatures: {
      dreamVsAwake: {
        description: "Classification between factual (awake) and imaginative (dream) memories",
        implementation: "Boolean flag with continuous confidence score",
        usage: "Contextually appropriate memory retrieval based on task type"
      },
      consistencyManagement: {
        description: "Detecting and resolving contradictions in memory",
        approaches: [
          "Logical contradiction detection",
          "Confidence-based resolution",
          "Explicit versioning of conflicting information",
          "Source prioritization"
        ]
      },
      multiModalSupport: {
        description: "Support for different types of memory beyond text",
        types: [
          "Text representations",
          "Structured data (JSON, tables)",
          "Numerical data",
          "References to external resources"
        ]
      }
    }
  };
  
  // Strengths analysis
  const strengths = [
    "Three-tier architecture balances performance and capacity needs",
    "Graph-based vector storage enables sophisticated relationship modeling",
    "Factual/imaginative gradient supports both knowledge and creative tasks",
    "Dynamic memory promotion and pruning mimics human memory processes",
    "Hierarchical structure allows for efficient scaling",
    "Classification system enables context-appropriate retrieval policies"
  ];
  
  // Potential challenges
  const challenges = [
    "Computational overhead of real-time graph maintenance",
    "Balancing response time with memory depth",
    "Ensuring factual consistency across long interaction chains",
    "Preventing memory poisoning with incorrect information",
    "Handling context switches without losing important information",
    "Determining optimal decay rates for different types of information",
    "Storage efficiency for large-scale deployment"
  ];
  
  // Overall architecture assessment
  console.log("MEMORY ARCHITECTURE ANALYSIS");
  console.log("===========================");
  console.log("\nCore Structure:");
  console.log("- Primary tiers: " + architectureComponents.memoryTiers.map(t => t.name).join(", "));
  console.log("- Classification dimensions: " + architectureComponents.memoryClassification.gradients.map(g => g.dimension).join(", "));
  
  console.log("\nKey Strengths:");
  strengths.forEach(s => console.log("✓ " + s));
  
  console.log("\nPotential Challenges:");
  challenges.forEach(c => console.log("! " + c));
  
  console.log("\nImplementation Complexity:");
  console.log("- Insertion: " + architectureComponents.operations.insertion.complexity);
  console.log("- Retrieval: " + architectureComponents.operations.retrieval.complexity);
  console.log("- Storage: Varies by tier (O(1) for cache, O(n) for persistent storage)");
  
  console.log("\nUnique Features:");
  console.log("- Dream vs. Awake Memory Classification");
  console.log("- Mimeograph Rollout Mechanism");
  console.log("- Graph-Based Vectorization");
  console.log("- Multi-Dimensional Memory Classification");

const natural = require('natural');
const tf = require('@tensorflow/tfjs-node');
const { Word2Vec } = require('word2vec');

class SemanticEmbedding {
    constructor() {
        this.model = null;
        this.vectorSize = 100;
    }

    async initialize() {
        // Placeholder for more advanced embedding initialization
        this.model = await tf.loadLayersModel('path/to/embedding/model');
    }

    async generateEmbedding(text) {
        // Generate semantic vector representation
        const tokens = natural.tokenize(text.toLowerCase());
        const embedding = await this.model.predict(tokens);
        return embedding;
    }

    calculateSemanticSimilarity(embedding1, embedding2) {
        // Cosine similarity calculation
        return tf.losses.cosineDistance(embedding1, embedding2);
    }
}

class MemoryItem {
    constructor(content, {
        type = "text", 
        isFactual = 0.5, 
        source = null,
        confidence = 0.5
    } = {}) {
        this.id = crypto.randomUUID(); // Unique identifier
        this.content = content;
        this.type = type;
        this.isFactual = isFactual;
        this.confidence = confidence;
        this.source = source;
        
        this.timestamp = Date.now();
        this.accessCount = 0;
        this.importance = 5;
        
        this.embedding = null;
        this.related = new Map(); // Enhanced relationship tracking
        this.tags = new Set();
    }

    async computeEmbedding(embeddingService) {
        this.embedding = await embeddingService.generateEmbedding(this.content);
    }

    addRelationship(memoryItem, weight = 1.0) {
        this.related.set(memoryItem.id, {
            memory: memoryItem,
            weight: weight,
            type: this.determineRelationshipType(memoryItem)
        });
    }

    determineRelationshipType(memoryItem) {
        // Semantic relationship type inference
        const semanticDistance = this.calculateSemanticDistance(memoryItem);
        if (semanticDistance < 0.2) return 'VERY_CLOSE';
        if (semanticDistance < 0.5) return 'RELATED';
        return 'DISTANT';
    }

    calculateSemanticDistance(memoryItem) {
        // Placeholder for semantic distance calculation
        return Math.random(); // Replace with actual embedding comparison
    }

    incrementAccess() {
        this.accessCount++;
        this.updateImportance();
    }

    updateImportance() {
        // Dynamic importance calculation
        this.importance = Math.min(
            10, 
            5 + Math.log(this.accessCount + 1)
        );
    }
}

class MemoryTier {
    constructor(name, {
        maxCapacity = Infinity,
        pruneStrategy = 'LRU'
    } = {}) {
        this.name = name;
        this.items = new Map(); // Use Map for efficient lookups
        this.maxCapacity = maxCapacity;
        this.pruneStrategy = pruneStrategy;
    }

    insert(memoryItem) {
        if (this.items.size >= this.maxCapacity) {
            this.prune();
        }
        this.items.set(memoryItem.id, memoryItem);
    }

    prune() {
        switch(this.pruneStrategy) {
            case 'LRU':
                const lruItem = Array.from(this.items.values())
                    .sort((a, b) => a.timestamp - b.timestamp)[0];
                this.items.delete(lruItem.id);
                break;
            case 'LEAST_IMPORTANT':
                const leastImportant = Array.from(this.items.values())
                    .sort((a, b) => a.importance - b.importance)[0];
                this.items.delete(leastImportant.id);
                break;
        }
    }

    async retrieve(query, embeddingService, topK = 5) {
        const queryEmbedding = await embeddingService.generateEmbedding(query);
        
        const scoredResults = Array.from(this.items.values())
            .map(item => ({
                memory: item,
                similarity: embeddingService.calculateSemanticSimilarity(
                    item.embedding, 
                    queryEmbedding
                )
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);

        return scoredResults.map(r => r.memory);
    }
}

class MemoryManager {
    constructor() {
        this.embeddingService = new SemanticEmbedding();
        
        this.volatileShortTerm = new MemoryTier("Volatile Short-Term", { 
            maxCapacity: 10,
            pruneStrategy: 'LRU'
        });
        
        this.persistentLongTerm = new MemoryTier("Persistent Long-Term");
        this.contextWorkingMemory = new MemoryTier("Context/Working Memory", { 
            maxCapacity: 5 
        });

        this.allMemories = new Map();
    }

    async initialize() {
        await this.embeddingService.initialize();
    }

    async insert(content, options = {}) {
        const memoryItem = new MemoryItem(content, options);
        await memoryItem.computeEmbedding(this.embeddingService);

        // Insert into all appropriate tiers
        this.volatileShortTerm.insert(memoryItem);
        this.persistentLongTerm.insert(memoryItem);
        this.contextWorkingMemory.insert(memoryItem);

        this.allMemories.set(memoryItem.id, memoryItem);
        return memoryItem;
    }

    async retrieve(query, tier = null) {
        if (tier) {
            return tier.retrieve(query, this.embeddingService);
        }

        // Parallel retrieval across tiers
        const results = await Promise.all([
            this.volatileShortTerm.retrieve(query, this.embeddingService),
            this.persistentLongTerm.retrieve(query, this.embeddingService),
            this.contextWorkingMemory.retrieve(query, this.embeddingService)
        ]);

        // Flatten and deduplicate results
        return [...new Set(results.flat())];
    }

    async findSemanticallySimilar(memoryItem, threshold = 0.7) {
        const similar = [];
        for (let [, memory] of this.allMemories) {
            if (memory.id !== memoryItem.id) {
                const similarity = this.embeddingService.calculateSemanticSimilarity(
                    memory.embedding, 
                    memoryItem.embedding
                );
                if (similarity >= threshold) {
                    similar.push({ memory, similarity });
                }
            }
        }
        return similar.sort((a, b) => b.similarity - a.similarity);
    }
}

// Example Usage
async function demonstrateMemorySystem() {
    const memoryManager = new MemoryManager();
    await memoryManager.initialize();

    // Insert memories
    const aiEthicsMem = await memoryManager.insert(
        "AI should be developed with strong ethical considerations", 
        { 
            type: "concept", 
            isFactual: 0.9, 
            confidence: 0.8 
        }
    );

    const aiResearchMem = await memoryManager.insert(
        "Machine learning research is advancing rapidly", 
        { 
            type: "research", 
            isFactual: 0.95 
        }
    );

    // Create relationships
    aiEthicsMem.addRelationship(aiResearchMem);

    // Retrieve memories
    const retrievedMemories = await memoryManager.retrieve("AI ethics");
    console.log("Retrieved Memories:", retrievedMemories);

    // Find semantically similar memories
    const similarMemories = await memoryManager.findSemanticallySimilar(aiEthicsMem);
    console.log("Similar Memories:", similarMemories);
}

demonstrateMemorySystem();

module.exports = { MemoryManager, MemoryItem, MemoryTier };

class MemoryTracer {
    constructor() {
        this.generationLog = new Map(); // Track memory generation lineage
        this.redundancyMap = new Map(); // Track potential redundant memories
        this.compressionMetrics = {
            totalMemories: 0,
            uniqueMemories: 0,
            redundancyRate: 0,
            compressionPotential: 0
        };
    }

    trackGeneration(memoryItem, parentMemories = []) {
        // Create a generation trace
        const generationEntry = {
            id: memoryItem.id,
            timestamp: Date.now(),
            content: memoryItem.content,
            parents: parentMemories.map(m => m.id),
            lineage: [
                ...parentMemories.flatMap(p => 
                    this.generationLog.get(p.id)?.lineage || []
                ),
                memoryItem.id
            ]
        };

        this.generationLog.set(memoryItem.id, generationEntry);
        this.updateRedundancyMetrics(memoryItem);
    }

    updateRedundancyMetrics(memoryItem) {
        // Semantic similarity check for redundancy
        const similarityThreshold = 0.9;
        let redundancyCount = 0;

        for (let [, existingMemory] of this.redundancyMap) {
            const similarity = this.calculateSemanticSimilarity(
                existingMemory.content, 
                memoryItem.content
            );

            if (similarity >= similarityThreshold) {
                redundancyCount++;
                this.redundancyMap.set(memoryItem.id, {
                    memory: memoryItem,
                    similarTo: existingMemory.id,
                    similarity: similarity
                });
            }
        }

        // Update compression metrics
        this.compressionMetrics.totalMemories++;
        this.compressionMetrics.redundancyRate = 
            (redundancyCount / this.compressionMetrics.totalMemories);
        this.compressionMetrics.compressionPotential = 
            this.calculateCompressionPotential();
    }

    calculateSemanticSimilarity(content1, content2) {
        // Placeholder for semantic similarity calculation
        // In a real implementation, use embedding-based similarity
        const words1 = new Set(content1.toLowerCase().split(/\s+/));
        const words2 = new Set(content2.toLowerCase().split(/\s+/));
        
        const intersection = new Set(
            [...words1].filter(x => words2.has(x))
        );

        return intersection.size / Math.max(words1.size, words2.size);
    }

    calculateCompressionPotential() {
        // Advanced compression potential calculation
        const { totalMemories, redundancyRate } = this.compressionMetrics;
        
        // Exponential decay of compression potential
        return Math.min(1, Math.exp(-redundancyRate) * 
            (1 - 1 / (1 + totalMemories)));
    }

    compressMemories(memoryManager) {
        const compressibleMemories = [];

        // Identify memories for potential compression
        for (let [id, redundancyEntry] of this.redundancyMap) {
            if (redundancyEntry.similarity >= 0.9) {
                compressibleMemories.push({
                    id: id,
                    similarTo: redundancyEntry.similarTo,
                    similarity: redundancyEntry.similarity
                });
            }
        }

        // Compression strategy
        const compressionStrategy = (memories) => {
            // Group similar memories
            const memoryGroups = new Map();
            
            memories.forEach(memoryInfo => {
                const groupKey = memoryInfo.similarTo;
                if (!memoryGroups.has(groupKey)) {
                    memoryGroups.set(groupKey, []);
                }
                memoryGroups.get(groupKey).push(memoryInfo);
            });

            // Merge similar memory groups
            const mergedMemories = [];
            for (let [baseId, group] of memoryGroups) {
                const baseMemory = memoryManager.allMemories.get(baseId);
                
                // Create a compressed representation
                const compressedContent = this.createCompressedContent(
                    group.map(g => 
                        memoryManager.allMemories.get(g.id).content
                    )
                );

                // Create a new compressed memory item
                const compressedMemory = new MemoryItem(compressedContent, {
                    type: baseMemory.type,
                    isFactual: baseMemory.isFactual,
                    confidence: Math.max(...group.map(g => 
                        memoryManager.allMemories.get(g.id).confidence
                    ))
                });

                mergedMemories.push(compressedMemory);
            }

            return mergedMemories;
        };

        // Execute compression
        const compressedMemories = compressionStrategy(compressibleMemories);

        // Update memory manager
        compressedMemories.forEach(memory => {
            memoryManager.insert(memory);
        });

        // Log compression results
        console.log('Memory Compression Report:', {
            totalCompressed: compressibleMemories.length,
            compressionPotential: this.compressionMetrics.compressionPotential
        });

        return compressedMemories;
    }

    createCompressedContent(contents) {
        // Intelligently combine similar memory contents
        const uniqueWords = new Set(
            contents.flatMap(content => 
                content.toLowerCase().split(/\s+/)
            )
        );

        // Create a concise summary
        return Array.from(uniqueWords).slice(0, 20).join(' ');
    }
}

// Modify MemoryManager to incorporate tracing
class MemoryManager {
    constructor() {
        // ... existing constructor code ...
        this.memoryTracer = new MemoryTracer();
    }

    async insert(content, options = {}, parentMemories = []) {
        const memoryItem = new MemoryItem(content, options);
        
        // Compute embedding and trace generation
        await memoryItem.computeEmbedding(this.embeddingService);
        this.memoryTracer.trackGeneration(memoryItem, parentMemories);

        // ... existing insertion code ...

        return memoryItem;
    }

    performMemoryCompression() {
        return this.memoryTracer.compressMemories(this);
    }
}

class MemoryTracer {
    constructor() {
        this.generationLog = new Map();
        this.redundancyThreshold = 0.85; // Semantic similarity threshold
        this.compressionMetrics = {
            totalMemories: 0,
            redundantMemories: 0,
            compressionRatio: 0,
            lastCompression: null
        };
    }

    trackGeneration(memoryItem, sourceOperation) {
        if (!this.generationLog.has(memoryItem.id)) {
            this.generationLog.set(memoryItem.id, {
                timestamp: Date.now(),
                sourceOperation,
                content: memoryItem.content,
                metadata: {
                    type: memoryItem.type,
                    isFactual: memoryItem.isFactual,
                    confidence: memoryItem.confidence
                },
                accessHistory: [],
                redundancyScore: 0
            });
            this.compressionMetrics.totalMemories++;
        }
    }

    recordAccess(memoryItem) {
        const logEntry = this.generationLog.get(memoryItem.id);
        if (logEntry) {
            logEntry.accessHistory.push({
                timestamp: Date.now(),
                accessCount: memoryItem.accessCount
            });
        }
    }

    async detectRedundancy(memoryManager, memoryItem) {
        const similarMemories = await memoryManager.findSemanticallySimilar(
            memoryItem, 
            this.redundancyThreshold
        );

        if (similarMemories.length > 1) {
            const logEntry = this.generationLog.get(memoryItem.id);
            if (logEntry) {
                logEntry.redundancyScore = similarMemories.length;
                this.compressionMetrics.redundantMemories++;
            }
            return similarMemories;
        }
        return [];
    }

    compressMemories(memoryManager) {
        const compressibleMemories = Array.from(memoryManager.allMemories.values())
            .filter(memory => {
                const logEntry = this.generationLog.get(memory.id);
                return logEntry && 
                       (logEntry.redundancyScore > 1 || 
                        memory.accessCount === 0 || 
                        (Date.now() - memory.timestamp > 30 * 24 * 60 * 60 * 1000)); // 30 days
            });

        // Compression strategy: Keep most representative memory, remove others
        compressibleMemories.forEach(memory => {
            if (memory.accessCount === 0) {
                memoryManager.removeMemory(memory);
            }
        });

        this.updateCompressionMetrics(compressibleMemories.length);
    }

    updateCompressionMetrics(compressedCount) {
        this.compressionMetrics.compressionRatio = 
            compressedCount / this.compressionMetrics.totalMemories;
        this.compressionMetrics.lastCompression = Date.now();
    }

    generateComprehensiveReport() {
        return {
            totalMemories: this.compressionMetrics.totalMemories,
            redundantMemories: this.compressionMetrics.redundantMemories,
            compressionRatio: this.compressionMetrics.compressionRatio,
            lastCompression: this.compressionMetrics.lastCompression
        };
    }
}

// Modify MemoryManager to integrate tracing
class MemoryManager {
    constructor() {
        // ... existing constructor code
        this.memoryTracer = new MemoryTracer();
    }

    async insert(content, options = {}) {
        const memoryItem = new MemoryItem(content, options);
        await memoryItem.computeEmbedding(this.embeddingService);

        // Track memory generation
        this.memoryTracer.trackGeneration(memoryItem, 'insert');

        // Detect potential redundancies
        const redundancies = await this.memoryTracer.detectRedundancy(this, memoryItem);

        // Insert into tiers
        this.volatileShortTerm.insert(memoryItem);
        this.persistentLongTerm.insert(memoryItem);
        this.contextWorkingMemory.insert(memoryItem);

        this.allMemories.set(memoryItem.id, memoryItem);
        return memoryItem;
    }

    async retrieve(query, tier = null) {
        const results = await super.retrieve(query, tier);
        
        // Track access for each retrieved memory
        results.forEach(memory => {
            this.memoryTracer.recordAccess(memory);
        });

        return results;
    }

    performMemoryCompression() {
        this.memoryTracer.compressMemories(this);
    }

    removeMemory(memory) {
        this.allMemories.delete(memory.id);
        this.volatileShortTerm.items.delete(memory.id);
        this.persistentLongTerm.items.delete(memory.id);
        this.contextWorkingMemory.items.delete(memory.id);
    }

    getMemoryCompressionReport() {
        return this.memoryTracer.generateComprehensiveReport();
    }
}

I know this redudant, but I just liked both responses. I also don't think you ever have said any of my insight was brilliant until just now so let's get this brilliancy fully figured out yes?
