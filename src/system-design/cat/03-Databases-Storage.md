# Databases & Storage for Principal/Staff Engineers

**One-line summary**: Master database internals, storage engines, transaction processing, and data modeling strategies for high-performance, scalable systems.

## Table of Contents
1. [OLTP vs OLAP Architecture](#oltp-vs-olap-architecture)
2. [Storage Engines](#storage-engines)
3. [Indexing Strategies](#indexing-strategies)
4. [Sharding & Partitioning](#sharding--partitioning)
5. [Transaction Isolation](#transaction-isolation)
6. [Distributed Transactions](#distributed-transactions)
7. [Query Optimization](#query-optimization)
8. [Data Modeling](#data-modeling)
9. [Backup & Recovery](#backup--recovery)
10. [Database Migrations](#database-migrations)
11. [Performance Monitoring](#performance-monitoring)
12. [Storage Economics](#storage-economics)

---

## OLTP vs OLAP Architecture

### Q1: Design a data architecture supporting both real-time transaction processing (10K TPS) and analytical queries without impacting transactional performance.

**Summary**: Implement lambda architecture with OLTP for transactions, ETL pipeline for data transformation, and OLAP for analytics, using change data capture for real-time synchronization without performance impact.

**Deep Answer**:
Design separate OLTP and OLAP systems optimized for their specific workloads. Use row-oriented database (PostgreSQL, MySQL) for OLTP with normalized schemas optimizing for insert/update performance. Deploy column-oriented database (Clickhouse, Snowflake) for OLAP with denormalized star/snowflake schemas optimizing for aggregation queries.

Implement change data capture (CDC) using database logs (binlog, WAL) to stream changes from OLTP to OLAP systems with minimal performance impact. Use message queues (Kafka) for reliable delivery and buffering during maintenance windows. Transform data during ingestion to match analytical schema requirements.

For near real-time analytics, deploy hybrid approaches: maintain hot data in operational stores with limited analytical capabilities, while cold data resides in optimized analytical stores. Use materialized views for frequently accessed aggregations, refreshed via CDC triggers.

Calculate capacity requirements: 10K TPS with 2KB average transaction size requires 20MB/s write throughput. Plan for 10x peak capacity (100K TPS). OLAP storage grows with retention requirements: 1 year retention ≈ 630TB raw data, requiring 3x storage for replication and compression considerations.

**Trade-offs**: Data freshness (CDC lag 5-30 seconds) vs transactional performance. Storage costs (2-3x for separate systems) vs query performance optimization. ETL complexity vs schema flexibility.

**Functional Follow-up Questions**:
- How do you handle schema evolution between OLTP and OLAP systems?
- What's your strategy for handling analytical queries that require real-time data?
- How do you implement data lineage tracking across OLTP and OLAP systems?
- What's your approach for handling data quality issues in the ETL pipeline?

**Non-Functional Follow-up Questions**:
- How do you ensure data privacy compliance across OLTP and OLAP systems?
- What monitoring validates data consistency between transactional and analytical stores?
- How do you balance ETL processing costs vs data freshness requirements?
- What's your disaster recovery strategy for coordinated OLTP/OLAP system failures?

**Interview Tip**: Demonstrate understanding of workload characteristics and business requirements driving architectural decisions.

---

## Storage Engines

### Q2: Compare B-tree, LSM-tree, and in-memory storage engines for a high-write, mixed-read workload system. Which would you choose and why?

**Summary**: LSM-trees excel for write-heavy workloads with eventual consistency tolerance, B-trees provide consistent read performance, and in-memory engines offer lowest latency but require careful memory management and persistence strategies.

**Deep Answer**:
B-tree engines (InnoDB, PostgreSQL) provide consistent O(log n) performance for both reads and writes with in-place updates. They suit workloads requiring consistent response times and strong consistency. Write amplification is higher due to page-level updates, but read performance remains predictable even during heavy write periods.

LSM-tree engines (RocksDB, Cassandra) optimize for write throughput using sequential writes to immutable sorted runs, periodically compacting to remove deleted entries and merge levels. Write amplification occurs during compaction, but initial writes are very fast. Read performance varies based on compaction state and requires bloom filters for efficient lookups.

In-memory engines (Redis, SAP HANA) eliminate disk I/O latency but require strategies for persistence and memory management. Use write-ahead logging for durability and snapshotting for recovery. Memory optimization techniques include compression, data structure selection, and garbage collection tuning.

For high-write mixed-read workloads, LSM-trees typically perform best due to superior write throughput. However, consider read amplification during compaction and implement appropriate caching strategies. Use tiered storage: hot data in memory, warm data in SSD-based LSM-trees, cold data in B-tree stores.

**Trade-offs**: Write performance vs read consistency. Memory efficiency vs access latency. Operational complexity vs performance optimization opportunities.

**Follow-up Questions**:
- How do you tune LSM-tree compaction policies for optimal performance?
- What strategies mitigate read performance degradation during compaction storms?

**Interview Tip**: Show understanding of workload patterns and their impact on storage engine selection.

---

## Indexing Strategies

### Q3: Design an indexing strategy for a multi-tenant SaaS application with complex query patterns and varying tenant sizes.

**Summary**: Implement composite indexes with tenant isolation, partial indexes for large tenants, and adaptive indexing strategies based on tenant query patterns and data volume to optimize performance across diverse workloads.

**Deep Answer**:
Design tenant-aware indexing starting with composite indexes (tenant_id, query_columns) to ensure efficient tenant isolation and query performance. For queries not filtering by tenant_id, create separate functional indexes but monitor for cross-tenant data leakage risks.

Implement tiered indexing based on tenant size: small tenants share standard indexes, while large tenants (>1M records) get dedicated partial indexes. Use conditional indexing: `CREATE INDEX idx_large_tenant_orders ON orders (order_date, status) WHERE tenant_id = 'large_tenant_123'` to optimize storage and maintenance overhead.

Deploy adaptive indexing using query pattern analysis: monitor slow query logs to identify missing indexes and automatically suggest/create indexes for frequently accessed patterns. Implement index usage monitoring to drop unused indexes that consume storage and slow down writes.

For complex analytical queries, implement covering indexes including all needed columns to avoid table lookups. Use expression indexes for computed columns frequently used in WHERE clauses. Consider columnstore indexes for analytical workloads on specific tenant segments.

**Trade-offs**: Storage overhead (30-50% for comprehensive indexing) vs query performance. Index maintenance cost during writes vs read optimization. Memory usage for index caches vs hit rates.

**Follow-up Questions**:
- How do you handle index maintenance during tenant data migrations?
- What's your approach for balancing index creation vs. write performance degradation?

**Interview Tip**: Emphasize monitoring-driven decisions and understanding of multi-tenancy challenges.

---

## Sharding & Partitioning

### Q4: Design a database sharding strategy for a social media platform handling 1B users with uneven activity patterns (celebrity vs regular user content).

**Summary**: Implement hybrid sharding combining user-based partitioning with activity-aware routing, hot shard detection, and dynamic rebalancing to handle celebrity traffic spikes while maintaining performance for regular users.

**Deep Answer**:
Implement hierarchical sharding starting with geographic partitioning (US, EU, APAC) for data locality, then user-based sharding within regions using consistent hashing on user_id. Plan for 1000 initial shards supporting 1M users each, allowing for growth to 10B users without major resharding.

Address celebrity hotspots using activity-based routing: monitor shard metrics (QPS, CPU, memory) and automatically promote high-activity users to dedicated shards or read replica clusters. Implement shadow traffic analysis to predict viral content before it overwhelms shards.

Deploy adaptive partitioning for content distribution: trending posts get replicated across multiple shards for read performance, while normal posts remain on home shards. Use bloom filters to quickly determine post location without cross-shard queries.

For follower relationships, implement bidirectional sharding: store following relationships on user's home shard, follower relationships on followed user's shard. This optimizes for both "user's timeline" and "who follows X" queries. Use fan-out strategies during post creation: push to active followers' timelines, pull for inactive followers.

**Trade-offs**: Query complexity for cross-shard operations vs scalability. Storage overhead (2-3x for replication) vs read performance. Operational complexity of hotspot management vs user experience during viral events.

**Follow-up Questions**:
- How do you handle friend recommendations across sharded user data?
- What's your strategy for migrating celebrity users between shard tiers?

**Interview Tip**: Demonstrate understanding of social media specific challenges and data access patterns.

---

## Transaction Isolation

### Q5: Explain how you would implement serializable isolation in a distributed database while maintaining high performance for a financial trading system.

**Summary**: Use optimistic concurrency control with timestamp ordering, conflict detection through dependency tracking, and strategic retry policies to achieve serializable isolation while minimizing performance impact in high-throughput trading scenarios.

**Deep Answer**:
Implement Serializable Snapshot Isolation (SSI) using optimistic concurrency control to avoid locking overhead during transaction execution. Assign logical timestamps to transactions and track read/write dependencies to detect serialization anomalies before commit.

Use predicate locking for range queries to prevent phantom reads while minimizing lock contention. Implement conflict detection through dependency graphs: if transaction T1 reads data that T2 modifies, and T2 commits first, abort T1 if it would violate serializable ordering.

Deploy strategic retry policies with exponential backoff and jitter to handle abort storms during high contention periods. For read-heavy workloads, use read-only transaction optimization where reads never abort and always see consistent snapshots.

For performance optimization in trading systems, implement transaction batching for related operations and use application-level conflict detection to pre-validate transactions before database submission. Deploy hot-cold data separation: frequently traded instruments use in-memory storage with different isolation strategies than historical data.

**Trade-offs**: Abortion rates (5-15% typical) vs consistency guarantees. CPU overhead for conflict detection vs correctness requirements. Latency spikes during retry storms vs throughput optimization.

**Follow-up Questions**:
- How do you tune abort retry policies for optimal throughput?
- What metrics indicate when to switch from optimistic to pessimistic concurrency control?

**Interview Tip**: Show understanding of financial system requirements and regulatory compliance implications.

---

## Distributed Transactions

### Q6: Design a cross-database transaction mechanism for order processing spanning inventory, payment, and shipping services without using 2PC.

**Summary**: Implement saga pattern with event choreography, compensating actions, and process monitoring to maintain transaction semantics across distributed services while avoiding distributed locking issues.

**Deep Answer**:
Design choreography-based saga where each service publishes events after successful local transactions, triggering subsequent steps in the workflow. Order service initiates by publishing OrderCreated event, inventory service reserves items and publishes InventoryReserved, payment service processes and publishes PaymentCompleted.

Implement compensating actions for each step: CancelInventoryReservation, RefundPayment, CancelShipping. Each service maintains compensation logic and subscribes to relevant failure events. Use timeout-based detection for stuck transactions with automatic compensation triggering.

Deploy saga state tracking using event sourcing: store all saga events with correlation IDs for audit trails and recovery. Implement saga orchestrator as fallback for complex workflows requiring centralized coordination and compensation ordering.

Use outbox pattern within each service: write business state changes and outgoing events in the same database transaction, then publish events asynchronously via change data capture. This ensures atomicity between state changes and event publishing, preventing lost events during failures.

**Trade-offs**: Eventual consistency vs immediate consistency. Implementation complexity vs system availability during partial failures. Compensation logic maintenance vs business requirement flexibility.

**Follow-up Questions**:
- How do you handle cascading compensations in complex saga workflows?
- What monitoring alerts indicate saga execution problems?

**Interview Tip**: Emphasize business impact understanding and operational considerations for distributed transaction failures.

---

## Query Optimization

### Q7: Optimize a complex analytical query joining 5 tables with 100M+ rows each, currently taking 45 minutes to execute.

**Summary**: Apply systematic optimization including index analysis, join reordering, partition elimination, parallel execution, and materialized view strategies to reduce query execution time by orders of magnitude.

**Deep Answer**:
Start with execution plan analysis to identify bottlenecks: table scans, nested loop joins, and sort operations consuming excessive time. Create covering indexes for join columns and frequently filtered attributes. Use composite indexes matching query's WHERE and ORDER BY clauses.

Implement partition elimination by restructuring queries to include partition key filters. If querying time-series data, add date range filters matching partition boundaries. Use partition-wise joins when both tables are partitioned on join keys.

Optimize join order using cost-based optimization: join smaller result sets first, use hash joins for large tables, and nested loop joins for small lookups. Consider denormalization for frequently joined tables, trading storage for query performance.

Deploy parallel query execution with appropriate degree of parallelism (DOP). For 100M row tables, use DOP 4-8 depending on available CPU cores and I/O capacity. Monitor parallel execution efficiency and adjust based on resource utilization.

Create materialized views for complex aggregations, refreshed incrementally using change data capture. For recurring analytical queries, pre-aggregate data using OLAP cubes or summary tables updated via ETL processes.

**Trade-offs**: Storage costs for indexes and materialized views vs query performance. Write performance degradation vs read optimization. Memory usage for parallel execution vs query completion time.

**Follow-up Questions**:
- How do you handle query optimization when data distribution changes over time?
- What's your approach for optimizing queries with dynamic WHERE clauses?

**Interview Tip**: Show systematic approach to performance analysis and quantifiable improvement metrics.

---

## How to Use This Study Guide

**Study Approach**:
- Practice with actual database systems, not just theory
- Set up test environments to experiment with storage engines and indexing
- Work through capacity planning calculations for realistic scenarios
- Study actual query execution plans from production systems

**Mock Interview Pacing**:
- Define requirements and constraints (5 minutes)
- Design data model and storage strategy (15 minutes)
- Discuss scalability and performance optimizations (15 minutes)
- Address operational concerns and monitoring (10 minutes)

**Hands-on Practice**: Set up local databases (PostgreSQL, MySQL, MongoDB) to experiment with different storage engines, create indexes, and analyze query performance. Practice reading and interpreting execution plans.