# Distributed Systems for Principal/Staff Engineers

**One-line summary**: Master consensus algorithms, coordination protocols, and distributed computing patterns essential for building resilient large-scale systems.

## Table of Contents
1. [Consensus Algorithms](#consensus-algorithms)
2. [Leader Election](#leader-election)
3. [Replication Strategies](#replication-strategies)
4. [Distributed Transactions](#distributed-transactions)
5. [Exactly-Once Semantics](#exactly-once-semantics)
6. [Clock Synchronization](#clock-synchronization)
7. [Distributed Locking](#distributed-locking)
8. [Split-Brain Prevention](#split-brain-prevention)
9. [Network Partitions](#network-partitions)
10. [Gossip Protocols](#gossip-protocols)
11. [Byzantine Fault Tolerance](#byzantine-fault-tolerance)
12. [Coordination Services](#coordination-services)

---

## Consensus Algorithms

### Q1: Compare Raft vs Multi-Paxos for a distributed database requiring strong consistency. When would you choose each?

**Summary**: Raft provides simpler implementation with leader-based log replication, while Multi-Paxos offers better performance under high concurrency. Choose Raft for simplicity, Multi-Paxos for throughput-critical systems.

**Deep Answer**:
Raft implements consensus through a strong leader model where all client requests go through the elected leader, ensuring linearizability. The leader replicates log entries to followers, requiring majority acknowledgment before committing. Raft's strength lies in its understandability and deterministic behavior during network partitions.

Multi-Paxos allows multiple proposers to operate concurrently, potentially achieving higher throughput by eliminating single-leader bottlenecks. However, this requires sophisticated conflict resolution and can lead to dueling proposers, reducing efficiency. Multi-Paxos Phase 1 (prepare) can be optimized away in stable scenarios, making it more efficient for high-throughput workloads.

For distributed databases, Raft suits systems prioritizing operational simplicity and strong consistency guarantees (etcd, MongoDB). Multi-Paxos fits better in scenarios requiring maximum throughput with sophisticated conflict resolution (Google Spanner uses Paxos variants). Raft's log compaction is simpler, while Paxos requires more complex state management.

Implementation considerations: Raft requires 3-5 nodes minimum for fault tolerance. Multi-Paxos can handle more complex topologies but requires careful tuning of ballot numbers and timeout values. Both require persistent storage for logs and careful handling of disk I/O in the critical path.

**Trade-offs**: Raft's simplicity vs Multi-Paxos throughput potential. Raft's leader bottleneck vs Multi-Paxos complexity. Deterministic behavior vs optimization opportunities.

**Functional Follow-up Questions**:
- How do you handle leader election storms during network instability?
- What optimizations would you apply to reduce consensus latency from 100ms to 10ms?
- How do you implement log compaction without violating consensus safety properties?
- What's your strategy for adding/removing nodes from consensus clusters without downtime?

**Non-Functional Follow-up Questions**:
- How do you validate consensus implementations maintain safety during Byzantine failures?
- What monitoring detects consensus performance degradation before it impacts applications?
- How do you ensure consensus algorithm changes maintain backward compatibility?
- What's your testing strategy for consensus behavior under network partition scenarios?

**Interview Tip**: Show understanding of both theoretical properties and practical implementation challenges.

---

## Leader Election

### Q2: Design a leader election mechanism for a microservices cluster that minimizes disruption during network partitions and node failures.

**Summary**: Implement lease-based leader election with exponential backoff, health monitoring, and graceful leadership transitions to minimize service disruption during failures.

**Deep Answer**:
Design a lease-based leader election system using distributed consensus store (etcd, Consul, Zookeeper). Leaders maintain leases with TTL (10-30 seconds) and must renew before expiration. Use jittered exponential backoff for lease renewal to prevent thundering herd during network issues.

Implement fencing tokens to prevent split-brain scenarios where multiple nodes believe they're leaders. Each successful election increments a generation number that must be included in all leadership actions. Followers reject commands with stale generation numbers.

Deploy health-check based pre-emptive leadership transfer: if a leader detects degraded performance (high GC pauses, disk I/O saturation), it voluntarily transfers leadership to a healthy follower before forced timeout. This reduces disruption from 30-second timeouts to 2-3 second transitions.

For network partitions, implement quorum-based decisions where leadership is only granted in partitions containing majority of nodes. Use failure detectors with phi-accrual to distinguish between slow nodes and failed nodes, adjusting timeout values based on historical network behavior.

**Trade-offs**: Lease renewal overhead vs failure detection speed. Shorter leases mean faster failover but more network traffic. Health-check complexity vs proactive failure handling.

**Follow-up Questions**:
- How do you handle cascading leadership changes during deployment rollouts?
- What metrics indicate optimal lease TTL values for your environment?

**Interview Tip**: Emphasize operational concerns like reducing customer impact during leadership transitions.

---

## Replication Strategies

### Q3: Design a replication strategy for a globally distributed system requiring both low read latency and strong write consistency.

**Summary**: Implement hierarchical replication with regional masters, asynchronous global replication, and read preference routing to balance latency and consistency requirements.

**Deep Answer**:
Design a hierarchical replication topology with regional clusters containing one master and multiple read replicas. Each region handles local writes with strong consistency (synchronous replication within region) while propagating changes asynchronously to other regions. This provides low read latency locally while maintaining global eventual consistency.

For critical data requiring global strong consistency, implement master-master replication with conflict resolution using vector clocks or operational transforms. Use application-level routing to direct writes to the authoritative region for specific data types (user profiles to home region, financial transactions to primary financial center).

Implement intelligent read routing based on data freshness requirements: real-time queries go to local master, analytics queries can use read replicas with acceptable lag. Deploy read-after-write consistency by tracking recent writes per client session and routing subsequent reads to sufficiently up-to-date replicas.

Use change data capture (CDC) for cross-region propagation with compression and batching for efficiency. Implement conflict resolution strategies: last-writer-wins for metadata, application-specific merge for business data, and manual resolution for critical conflicts.

**Trade-offs**: Storage overhead (3-5x for global replication) vs read performance. Write latency increases for cross-region consistency. Complexity of conflict resolution vs data integrity guarantees.

**Follow-up Questions**:
- How do you handle replication lag during network degradation between regions?
- What's your approach for schema migrations across replicated databases?

**Interview Tip**: Show understanding of business requirements driving consistency vs performance trade-offs.

---

## Distributed Transactions

### Q4: Implement distributed transactions across multiple microservices without using traditional 2PC. How do you ensure ACID properties?

**Summary**: Use saga patterns with compensation logic, event sourcing for audit trails, and idempotent operations to maintain transaction semantics without distributed locking.

**Deep Answer**:
Implement the Saga pattern using choreography or orchestration approaches. In choreography, each service publishes events after completing its local transaction, triggering the next step in the workflow. For orchestration, deploy a central coordinator managing the transaction flow with explicit compensation steps.

Design compensating operations for each transaction step: if payment succeeds but inventory allocation fails, automatically trigger payment refund. Use event sourcing to maintain complete audit trails of transaction attempts, successes, and compensations. This ensures recoverability and regulatory compliance.

Implement idempotent operations using unique request identifiers and deduplication logic. Each service stores processed request IDs with TTL to handle duplicate messages from retry mechanisms. Use optimistic locking with version numbers to handle concurrent updates within individual services.

Deploy timeout-based cleanup for incomplete transactions: if a saga doesn't complete within SLA timeouts, trigger automatic compensation. Use dead letter queues for failed compensation attempts requiring manual intervention. Implement saga state persistence for recovery across service restarts.

**Trade-offs**: Eventual consistency vs immediate consistency. Increased complexity vs elimination of distributed locking. Compensation logic maintenance overhead vs system availability during failures.

**Follow-up Questions**:
- How do you handle partial failures during compensation operations?
- What monitoring alerts indicate saga execution problems?

**Interview Tip**: Demonstrate understanding of business impact and recovery scenarios for failed transactions.

---

## Exactly-Once Semantics

### Q5: Design exactly-once message processing in a distributed stream processing system handling financial transactions.

**Summary**: Combine idempotent operations, message deduplication, and transactional outbox patterns to achieve exactly-once processing semantics for critical financial data.

**Deep Answer**:
Implement exactly-once semantics using three complementary mechanisms: producer idempotency, consumer deduplication, and transactional processing. Producers include unique message IDs and use idempotent retry logic. Kafka's exactly-once semantics (EOS) provides producer-level guarantees through sequence numbers and producer epochs.

For consumers, implement deduplication using distributed cache (Redis) storing processed message IDs with appropriate TTL. Use consistent hashing to distribute deduplication state across cache nodes for scalability. For database operations, use upsert operations with business keys rather than generated IDs to ensure idempotency.

Deploy transactional outbox pattern: write business state changes and outgoing messages within the same database transaction, then asynchronously publish messages using change data capture. This ensures atomicity between state changes and message publishing, preventing dual-write problems.

For stream processing, use Kafka Streams' exactly-once processing with transaction boundaries spanning multiple topic partitions. Configure appropriate commit intervals balancing latency and duplicate processing risk during rebalancing.

**Trade-offs**: Performance overhead (10-20%) vs correctness guarantees. Storage overhead for deduplication state vs duplicate message prevention. Increased complexity vs business requirement compliance.

**Follow-up Questions**:
- How do you handle exactly-once semantics during consumer group rebalancing?
- What's your strategy for TTL management in deduplication caches?

**Interview Tip**: Emphasize the business criticality of exactly-once processing in financial systems and regulatory implications.

---

## Clock Synchronization

### Q6: How do you handle distributed system operations requiring precise ordering when system clocks are not perfectly synchronized?

**Summary**: Use logical clocks (Lamport timestamps, vector clocks) combined with hybrid logical clocks for ordering events, avoiding dependency on physical clock synchronization for correctness.

**Deep Answer**:
Implement logical clocks for event ordering rather than relying on physical timestamps. Lamport timestamps provide happens-before ordering: each process maintains a counter incremented for local events and updated to max(local_counter, received_counter) + 1 for received events. This ensures causal ordering without clock synchronization.

For concurrent event detection, deploy vector clocks where each process maintains counters for all processes. Events are concurrent if neither vector clock is strictly greater than the other. Use this for conflict detection in distributed databases and collaborative editing systems.

Hybrid Logical Clocks (HLC) combine physical and logical time, providing approximate wall-clock ordering while maintaining logical consistency. HLC helps with human-readable timestamps while preserving causal relationships. This suits systems requiring both ordering and meaningful timestamps for monitoring.

For operations requiring strict ordering (financial transactions), implement total ordering using single-leader assignment of sequence numbers or distributed sequence number generation with ranges allocated to each node. Use consensus protocols to handle leader failures in sequence number assignment.

**Trade-offs**: Logical clock overhead vs ordering accuracy. Vector clock storage growth (O(n) per event) vs concurrent event detection. Physical clock dependency vs human-readable timestamps.

**Follow-up Questions**:
- How do you compact vector clocks in long-running distributed systems?
- What's your approach for migrating from timestamp-based to logical clock-based ordering?

**Interview Tip**: Show understanding that distributed systems shouldn't rely on synchronized clocks for correctness.

---

## How to Use This Study Guide

**Study Approach**:
- Focus on 2-3 algorithms per day, implementing pseudocode for each
- Practice drawing message flows and state transitions
- Work through failure scenarios and recovery mechanisms
- Create decision trees for choosing between different approaches

**Mock Interview Pacing**:
- Explain the problem and constraints (5 minutes)
- Describe chosen algorithm with trade-offs (15 minutes)
- Walk through failure scenarios (10 minutes)
- Discuss monitoring and operational concerns (10 minutes)

**Deep Dive Topics**: Practice implementing consensus algorithms in pseudocode, understand proof sketches for safety and liveness properties, and master the operational aspects of running distributed consensus in production.