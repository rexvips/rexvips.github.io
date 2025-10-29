# Algorithms & Data Structures for Principal/Staff Engineers

**One-line summary**: Master algorithms and data structures with system-level impact focus, emphasizing concurrency-safe implementations, performance optimization, and distributed system applications.

## Table of Contents
1. [Concurrency-Safe Data Structures](#concurrency-safe-data-structures)
2. [Rate Limiting Algorithms](#rate-limiting-algorithms)
3. [Distributed Algorithms](#distributed-algorithms)
4. [Caching & Eviction Algorithms](#caching--eviction-algorithms)
5. [Probabilistic Data Structures](#probabilistic-data-structures)
6. [Graph Algorithms for Systems](#graph-algorithms-for-systems)
7. [String Algorithms & Search](#string-algorithms--search)
8. [Streaming Algorithms](#streaming-algorithms)
9. [Load Balancing Algorithms](#load-balancing-algorithms)
10. [Consensus & Coordination](#consensus--coordination)
11. [Memory Management](#memory-management)
12. [Performance Optimization](#performance-optimization)

---

## Concurrency-Safe Data Structures

### Q1: Design a thread-safe LRU cache supporting 100K+ concurrent operations per second with minimal contention and consistent O(1) performance characteristics.

**Summary**: Implement lock-free LRU cache using segmented design, compare-and-swap operations, and memory layout optimization to achieve high concurrency performance while maintaining cache semantics.

**Deep Answer**:
Design segmented LRU cache with multiple independent cache segments (16-32 segments) to reduce contention. Each segment maintains its own LRU list and hash map, with global hash function distributing keys across segments. This reduces lock contention from all threads competing for single lock to threads competing within segments.

Implement lock-free operations using compare-and-swap (CAS) for atomic updates. Use hazard pointers or epoch-based memory reclamation to safely manage memory in lock-free environment. Design cache entry structure with atomic reference counting and version numbers to handle concurrent access without locks.

Optimize memory layout for cache performance using cache-line padding to prevent false sharing between segments. Align data structures to cache line boundaries (64 bytes) and use memory pools for cache entry allocation to reduce memory fragmentation and improve locality.

Implement adaptive concurrency control monitoring contention levels and adjusting segment count or switching to different synchronization mechanisms (spin locks, reader-writer locks) based on access patterns and system load characteristics.

**Trade-offs**: Memory overhead (30-50% for segmentation) vs contention reduction. Implementation complexity vs performance gains. Lock-free benefits vs debugging difficulty.

**Functional Follow-up Questions**:
- How do you handle cache coherence when implementing distributed LRU cache across multiple nodes?
- What's your strategy for LRU cache resizing without stopping concurrent operations?
- How do you implement cache statistics and monitoring without impacting performance?
- How do you handle cache warmup strategies for newly allocated segments?

**Non-Functional Follow-up Questions**:
- How do you validate lock-free correctness without extensive testing infrastructure?
- What strategies prevent memory leaks in lock-free data structures during high contention?
- How do you measure and optimize cache performance under different workload patterns?
- What's your approach for debugging race conditions in lock-free implementations?

**Interview Tip**: Emphasize understanding of concurrency challenges and practical performance optimization techniques.

---

## Rate Limiting Algorithms

### Q2: Implement rate limiting for a public API serving 1M+ requests per minute with requirements for burst handling, user-specific limits, and distributed enforcement across multiple servers.

**Summary**: Design multi-tier rate limiting using token bucket algorithm with Redis-based distributed state, hierarchical limiting strategies, and adaptive burst handling to protect API infrastructure while maintaining user experience.

**Deep Answer**:
Implement token bucket algorithm with configurable parameters: bucket capacity for burst handling, refill rate for sustained throughput, and per-user bucket isolation. Use Redis for distributed token bucket state with atomic operations ensuring consistency across multiple API gateway instances.

Design hierarchical rate limiting with global limits (API-wide), tenant limits (per customer), user limits (per individual user), and endpoint limits (per API method). Implement precedence rules where most restrictive limit applies, with appropriate error responses indicating which limit was exceeded.

Deploy adaptive rate limiting monitoring request patterns and automatically adjusting limits based on system capacity and user behavior. Implement burst detection allowing temporary limit increases for trusted users while maintaining protection against abuse patterns.

Implement efficient distributed counting using Redis Lua scripts for atomic operations combining multiple rate limit checks in single Redis call. Use sliding window counters for more accurate rate limiting compared to fixed windows, implementing memory-efficient sliding window approximation.

**Trade-offs**: Rate limiting accuracy vs performance overhead. Burst allowance vs system protection. Distributed coordination latency vs enforcement consistency.

**Functional Follow-up Questions**:
- How do you handle rate limiting for batch API operations that process multiple items per request?
- What's your strategy for rate limiting during system recovery after outages or maintenance?
- How do you implement rate limiting exemptions for critical business operations or emergency scenarios?
- How do you handle rate limiting across different API versions with varying performance characteristics?

**Non-Functional Follow-up Questions**:
- How do you ensure rate limiting doesn't become a bottleneck for legitimate high-volume users?
- What strategies prevent rate limiting bypass through distributed attacks or spoofing?
- How do you validate rate limiting effectiveness without impacting user experience during testing?
- What's your approach for rate limiting configuration management and dynamic adjustment?

**Interview Tip**: Show understanding of rate limiting business impact and distributed system implementation challenges.

---

## Distributed Algorithms

### Q3: Design a distributed leader election algorithm for a microservices cluster requiring split-brain prevention, network partition tolerance, and sub-second failover times.

**Summary**: Implement Raft-based leader election with optimized timing parameters, witness nodes for split-brain prevention, and pre-vote mechanisms to achieve fast, reliable leadership transitions in distributed environments.

**Deep Answer**:
Implement Raft leader election with optimized timing parameters: heartbeat interval 50ms, election timeout randomized between 150-300ms, and pre-vote phase to prevent unnecessary elections. Use witness nodes (non-voting members) in even-numbered clusters to break ties and prevent split-brain scenarios.

Design network partition tolerance using quorum-based decisions where leadership requires majority node acknowledgment. Implement failure detection using phi-accrual failure detectors adapting to network conditions and distinguishing between slow nodes and failed nodes.

Deploy leadership transfer optimization allowing current leader to transfer leadership proactively during planned maintenance or when detecting performance degradation. Implement fast leader discovery allowing new nodes to quickly identify current leader without waiting for full election cycle.

Implement leadership lease mechanisms where leader maintains leadership through periodic lease renewal with majority of nodes. Use lease-based fencing tokens preventing split-brain scenarios where network partitions create multiple leaders.

**Trade-offs**: Election speed vs split-brain prevention. Network overhead for failure detection vs failover time. Quorum size requirements vs fault tolerance levels.

**Functional Follow-up Questions**:
- How do you handle leader election in asymmetric network partitions where some nodes can communicate but others cannot?
- What's your strategy for leader election during rolling updates or planned maintenance scenarios?
- How do you implement leader election for geographically distributed clusters with high network latency?
- How do you handle leader election when cluster membership changes dynamically?

**Non-Functional Follow-up Questions**:
- How do you validate leader election correctness under various network failure scenarios?
- What strategies ensure leader election doesn't cause service disruption during normal operations?
- How do you monitor leader election health and detect pathological election behaviors?
- What's your approach for leader election performance optimization and tuning?

**Interview Tip**: Demonstrate understanding of distributed consensus challenges and practical implementation considerations.

---

## Probabilistic Data Structures

### Q4: Design a system for detecting duplicate content in a high-throughput content publishing platform using probabilistic data structures to minimize memory usage while maintaining accuracy.

**Summary**: Implement bloom filters with counting bloom filters for deletion support, hyperloglog for cardinality estimation, and layered filtering approach to achieve memory-efficient duplicate detection with configurable accuracy levels.

**Deep Answer**:
Design layered probabilistic filtering using bloom filters for initial duplicate screening with configurable false positive rates (0.1-1%). Implement counting bloom filters supporting element deletion for content that expires or gets removed. Use multiple hash functions (3-5) with different seeds to minimize hash correlation.

Deploy HyperLogLog for approximate cardinality tracking enabling duplicate rate estimation and capacity planning without storing actual content identifiers. Configure HyperLogLog precision (12-16 bits) balancing memory usage with accuracy requirements for different use cases.

Implement content fingerprinting using locality-sensitive hashing (LSH) for near-duplicate detection beyond exact matches. Design MinHash signatures for jaccard similarity estimation enabling detection of content variations and derivative works.

Design memory optimization strategies including bloom filter resizing, periodic filter regeneration, and tiered storage where hot filters stay in memory while cold filters move to SSD storage. Implement filter federation across multiple servers for scaling beyond single-node memory limits.

**Trade-offs**: Memory efficiency vs false positive rates. Accuracy guarantees vs performance characteristics. Implementation complexity vs operational simplicity.

**Functional Follow-up Questions**:
- How do you handle probabilistic data structure maintenance during content purges and policy changes?
- What's your strategy for probabilistic structure accuracy validation in production environments?
- How do you implement probabilistic structures for content similarity detection beyond exact duplicates?
- How do you handle probabilistic structure coordination across geographically distributed systems?

**Non-Functional Follow-up Questions**:
- How do you validate probabilistic structure accuracy without compromising memory efficiency benefits?
- What strategies prevent probabilistic structure degradation from impacting content quality?
- How do you monitor probabilistic structure performance and optimize for different content patterns?
- What's your approach for probabilistic structure configuration tuning and capacity planning?

**Interview Tip**: Show understanding of probabilistic structure trade-offs and practical applications in large-scale systems.

---

## Streaming Algorithms

### Q5: Implement real-time analytics for a social media platform calculating trending topics, user engagement metrics, and anomaly detection over unbounded data streams with memory constraints.

**Summary**: Design streaming analytics using sliding window algorithms, reservoir sampling, and incremental statistics computation to process high-volume social media streams with bounded memory and real-time latency requirements.

**Deep Answer**:
Implement sliding window algorithms using time-based and count-based windows for trending topic calculation. Use exponential decay functions for time-weighted popularity scoring where recent activity has higher weight. Design memory-bounded windows with efficient data structure rotation (circular buffers, segment trees).

Deploy reservoir sampling for maintaining representative samples of large data streams enabling statistical analysis without storing complete datasets. Implement adaptive sampling rates based on data velocity and available memory constraints.

Design incremental statistics computation using online algorithms for mean, variance, and quantile estimation without storing historical data. Implement Count-Min Sketch for frequency estimation of hashtags and mentions with configurable accuracy parameters.

Implement anomaly detection using streaming algorithms for outlier detection (Z-score, isolation forest adaptations) and change point detection (CUSUM, EWMA) enabling real-time identification of viral content or unusual activity patterns.

**Trade-offs**: Real-time processing latency vs accuracy guarantees. Memory usage vs statistical precision. Algorithm complexity vs implementation maintainability.

**Functional Follow-up Questions**:
- How do you handle streaming algorithm state recovery after system failures or restarts?
- What's your strategy for streaming algorithm accuracy validation with ground truth data?
- How do you implement streaming algorithms for multi-dimensional data analysis and correlation detection?
- How do you handle streaming algorithm coordination across multiple processing nodes?

**Non-Functional Follow-up Questions**:
- How do you validate streaming algorithm accuracy without access to complete datasets?
- What strategies ensure streaming algorithms maintain performance under varying data velocities?
- How do you monitor streaming algorithm health and detect algorithmic drift or degradation?
- What's your approach for streaming algorithm parameter tuning and performance optimization?

**Interview Tip**: Emphasize understanding of streaming algorithm constraints and real-world applicability to large-scale data processing.

---

## Graph Algorithms for Systems

### Q6: Design dependency resolution and circular dependency detection for a package management system handling millions of packages with complex dependency trees.

**Summary**: Implement topological sorting with cycle detection, efficient dependency graph representation, and incremental update algorithms to handle large-scale package dependencies with performance and correctness guarantees.

**Deep Answer**:
Design dependency graph representation using adjacency lists with efficient storage (compressed sparse row format) and indexing for fast dependency lookup. Implement bidirectional edges tracking both dependencies and dependents for efficient impact analysis during updates.

Deploy topological sorting using Kahn's algorithm with cycle detection for dependency resolution ordering. Implement incremental topological sorting for efficient updates when packages are added/removed without full graph recomputation. Use DFS-based strong connected component detection for circular dependency identification.

Design efficient cycle breaking strategies when circular dependencies are detected: identify minimum feedback arc set, provide user-friendly cycle reporting, and implement dependency conflict resolution policies (version ranges, optional dependencies).

Implement dependency graph optimization including transitive reduction for storage efficiency, dependency caching for repeated resolution requests, and parallel dependency resolution for large dependency trees using work-stealing task scheduling.

**Trade-offs**: Graph storage overhead vs query performance. Incremental update complexity vs full recomputation simplicity. Cycle detection accuracy vs performance characteristics.

**Functional Follow-up Questions**:
- How do you handle dependency resolution for packages with version constraints and compatibility requirements?
- What's your strategy for dependency graph updates when packages change their dependency requirements?
- How do you implement dependency resolution for different package ecosystems with varying dependency semantics?
- How do you handle dependency resolution performance for extremely large dependency graphs?

**Non-Functional Follow-up Questions**:
- How do you validate dependency resolution correctness without extensive integration testing?
- What strategies prevent dependency resolution from becoming a bottleneck in package operations?
- How do you monitor dependency graph health and detect problematic dependency patterns?
- What's your approach for dependency resolution optimization and algorithm performance tuning?

**Interview Tip**: Show understanding of graph algorithm applications in system design and practical performance considerations.

---

## How to Use This Study Guide

**Study Approach**:
- Implement algorithms from scratch to understand performance characteristics and trade-offs
- Practice algorithm selection for different system requirements and constraints
- Work through algorithm optimization scenarios with realistic performance targets
- Study algorithm applications in production systems and open-source projects

**Mock Interview Pacing**:
- Understand problem constraints and requirements (5 minutes)
- Design algorithm approach with complexity analysis (15 minutes)
- Implement key algorithm components with optimization considerations (15 minutes)
- Discuss trade-offs, testing, and production deployment considerations (5 minutes)

**Advanced Practice**: Focus on algorithms with direct system impact, concurrent implementations, and distributed algorithm coordination. Practice explaining algorithm choices in terms of business requirements and system constraints.