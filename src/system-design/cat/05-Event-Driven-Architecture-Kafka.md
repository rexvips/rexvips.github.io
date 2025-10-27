# Event-Driven Architecture & Kafka for Principal/Staff Engineers

**One-line summary**: Master event streaming, Kafka internals, and event-driven patterns for building scalable, resilient distributed systems with strong consistency and ordering guarantees.

## Table of Contents
1. [Kafka Architecture & Internals](#kafka-architecture--internals)
2. [Partitioning Strategies](#partitioning-strategies)
3. [Consumer Groups & Scaling](#consumer-groups--scaling)
4. [Ordering Guarantees](#ordering-guarantees)
5. [Retention & Storage](#retention--storage)
6. [Kafka Streams vs KSQL](#kafka-streams-vs-ksql)
7. [Idempotency & Exactly-Once](#idempotency--exactly-once)
8. [Schema Evolution](#schema-evolution)
9. [Event Sourcing Patterns](#event-sourcing-patterns)
10. [Monitoring & Operations](#monitoring--operations)
11. [Multi-Region Setup](#multi-region-setup)
12. [Performance Optimization](#performance-optimization)

---

## Kafka Architecture & Internals

### Q1: Design a Kafka cluster architecture for a financial services platform processing 1M transactions/day with strict ordering, durability, and compliance requirements.

**Summary**: Implement multi-broker Kafka cluster with appropriate replication, ISR management, and durability settings to ensure transaction ordering, prevent data loss, and meet financial regulatory compliance requirements.

**Deep Answer**:
Design a 5-broker Kafka cluster across 3 availability zones (2-2-1 distribution) with replication factor 3 and min.insync.replicas=2 to ensure durability without single points of failure. For 1M transactions/day (~12 TPS average, ~120 TPS peak), configure appropriate partition counts based on consumer parallelism requirements and expected growth.

Configure producer settings for maximum durability: `acks=all`, `retries=Integer.MAX_VALUE`, `enable.idempotence=true` to prevent duplicate messages. Set `max.in.flight.requests.per.connection=1` to maintain strict ordering within partitions. Use synchronous sends for critical financial transactions despite performance impact.

Implement log segment configuration for compliance: `log.retention.hours=175200` (20 years), `log.segment.bytes=1GB`, `log.cleanup.policy=compact,delete` for audit trails. Configure `unclean.leader.election.enable=false` to prevent data loss during leader elections, accepting availability trade-offs for consistency.

Deploy comprehensive monitoring covering broker metrics (request rates, log lag, ISR shrinkage), producer metrics (batch sizes, compression ratios, retry counts), and cluster health (under-replicated partitions, offline partitions, controller election frequency).

**Trade-offs**: Higher latency (50-100ms) vs durability guarantees. Storage costs for long retention vs regulatory compliance. Availability reduction vs consistency requirements during network partitions.

**Functional Follow-up Questions**:
- How do you handle Kafka cluster upgrades without downtime for critical financial transactions?
- What's your strategy for partition rebalancing during broker failures in peak trading hours?
- How do you ensure transaction ordering across multiple related topics?
- How do you implement end-to-end transaction traceability across the event pipeline?

**Non-Functional Follow-up Questions**:
- What monitoring alerts prevent compliance violations during Kafka operations?
- How do you validate Kafka configuration changes don't compromise durability guarantees?
- What's your disaster recovery strategy for complete Kafka cluster failure?
- How do you ensure Kafka performance meets SLA requirements during regulatory audits?

**Interview Tip**: Emphasize understanding of financial industry requirements and regulatory compliance implications.

---

## Partitioning Strategies

### Q2: Design a partitioning strategy for an e-commerce platform where you need to maintain order processing sequence per customer while maximizing parallel processing capabilities.

**Summary**: Use customer-based partitioning with consistent hashing, implement partition affinity for related events, and design consumer scaling strategies to balance ordering guarantees with processing parallelism.

**Deep Answer**:
Implement customer-based partitioning using customer_id as the partition key with murmur3 hash algorithm for even distribution. This ensures all events for a specific customer land in the same partition, maintaining per-customer ordering while enabling parallel processing across different customers.

Calculate partition count based on expected consumer parallelism and growth projections. For 100K active customers with average 5 orders/day, plan for 32-64 partitions supporting 32-64 concurrent consumers. Use consistent hashing to minimize rebalancing impact when adding partitions.

Handle related events (order created, payment processed, shipment initiated) by using composite keys: `customer_id#order_id` to maintain strict ordering within order lifecycle while distributing different orders across partitions. Implement partition affinity for session-based events using session_id prefixes.

Design consumer scaling strategies with partition assignment awareness: implement custom partition assignors for sticky assignment, use consumer group coordination for graceful rebalancing, and implement backpressure handling when consumers cannot keep up with production rates.

**Trade-offs**: Partition hotspots with uneven customer activity vs strict ordering guarantees. Limited parallelism per customer vs system-wide scalability. Partition count optimization complexity vs future scaling flexibility.

**Functional Follow-up Questions**:
- How do you handle partition hotspots during flash sales or celebrity customer activity?
- What's your approach for rebalancing partitions when adding new consumer instances?
- How do you maintain ordering when implementing retry logic for failed message processing?
- How do you handle customer data migration between partitions during system scaling?

**Non-Functional Follow-up Questions**:
- How do you monitor partition distribution effectiveness across the customer base?
- What strategies prevent partition skew from impacting overall system performance?
- How do you validate partitioning changes maintain ordering guarantees?
- What's your approach for capacity planning based on partition utilization metrics?

**Interview Tip**: Show understanding of business requirements driving partitioning decisions and operational impact.

---

## Idempotency & Exactly-Once

### Q3: Design exactly-once message processing in a distributed stream processing system handling financial transactions.

**Summary**: Combine idempotent operations, message deduplication, and transactional outbox patterns to achieve exactly-once processing semantics for critical financial data.

**Deep Answer**:
Implement exactly-once semantics using three complementary mechanisms: producer idempotency, consumer deduplication, and transactional processing. Producers include unique message IDs and use idempotent retry logic. Kafka's exactly-once semantics (EOS) provides producer-level guarantees through sequence numbers and producer epochs.

For consumers, implement deduplication using distributed cache (Redis) storing processed message IDs with appropriate TTL. Use consistent hashing to distribute deduplication state across cache nodes for scalability. For database operations, use upsert operations with business keys rather than generated IDs to ensure idempotency.

Deploy transactional outbox pattern: write business state changes and outgoing messages within the same database transaction, then asynchronously publish messages using change data capture. This ensures atomicity between state changes and message publishing, preventing dual-write problems.

For stream processing, use Kafka Streams' exactly-once processing with transaction boundaries spanning multiple topic partitions. Configure appropriate commit intervals balancing latency and duplicate processing risk during rebalancing.

**Trade-offs**: Performance overhead (10-20%) vs correctness guarantees. Storage overhead for deduplication state vs duplicate message prevention. Increased complexity vs business requirement compliance.

**Functional Follow-up Questions**:
- How do you handle exactly-once semantics during consumer group rebalancing?
- What's your strategy for TTL management in deduplication caches?
- How do you implement exactly-once processing across multiple Kafka clusters?
- How do you handle idempotency for operations that span multiple database transactions?

**Non-Functional Follow-up Questions**:
- How do you monitor exactly-once processing effectiveness in production systems?
- What strategies ensure exactly-once implementations don't introduce performance bottlenecks?
- How do you validate exactly-once behavior during disaster recovery scenarios?
- What's your testing approach for exactly-once semantics under various failure conditions?

**Interview Tip**: Emphasize the business criticality of exactly-once processing in financial systems and regulatory implications.

---

## Schema Evolution

### Q4: Implement schema evolution strategy for a high-throughput event streaming platform with multiple consumer teams having different upgrade schedules.

**Summary**: Use schema registry with backward/forward compatibility rules, implement gradual rollout strategies, and design consumer resilience patterns to handle schema changes without service disruption.

**Deep Answer**:
Deploy Confluent Schema Registry or equivalent with strict compatibility policies: backward compatibility for consumer upgrades, forward compatibility for producer upgrades, and full compatibility for bidirectional evolution. Use Avro or Protocol Buffers for rich schema evolution support with default values and optional fields.

Implement schema versioning strategy with semantic versioning: major versions for breaking changes, minor versions for backward-compatible additions, patch versions for documentation updates. Design producer code to publish schema versions explicitly and consumer code to handle multiple schema versions gracefully.

Design gradual rollout process: deploy new schema versions to staging environments, validate consumer compatibility using shadow traffic, rollout producers with new schemas using feature flags, then upgrade consumers at their own pace. Use canary deployments for schema changes with automatic rollback on compatibility failures.

Implement consumer resilience patterns: ignore unknown fields for forward compatibility, provide default values for missing fields for backward compatibility, and use schema evolution testing frameworks to validate compatibility matrices across service versions.

**Trade-offs**: Schema evolution flexibility vs system complexity. Deployment coordination overhead vs service autonomy. Schema validation performance vs compatibility guarantees.

**Functional Follow-up Questions**:
- How do you handle schema evolution for events that require strict ordering guarantees?
- What's your strategy for deprecating old schema versions without breaking existing consumers?
- How do you implement schema evolution for complex nested data structures?
- How do you handle schema changes that affect business logic in downstream consumers?

**Non-Functional Follow-up Questions**:
- How do you ensure schema evolution doesn't violate data governance policies?
- What monitoring detects schema compatibility issues before they impact consumers?
- How do you validate schema evolution changes across all consuming applications?
- What's your approach for schema evolution documentation and team coordination?

**Interview Tip**: Show understanding of schema evolution impact on system architecture and team coordination challenges.

---

## Kafka Streams vs KSQL

### Q5: Compare Kafka Streams and ksqlDB for implementing real-time analytics on user behavior data requiring complex aggregations, joins, and windowing operations.

**Summary**: Kafka Streams provides programmatic flexibility and performance optimization for complex logic, while ksqlDB offers SQL-based simplicity for standard operations. Choose based on complexity requirements, team skills, and operational preferences.

**Deep Answer**:
Kafka Streams excels for complex business logic requiring custom processors, state store optimization, and fine-grained control over processing topology. It provides type safety, IDE support, and integration with existing Java ecosystems. Custom serializers, processors, and transformers enable optimization for specific use cases.

ksqlDB simplifies development for standard analytical operations using familiar SQL syntax. It provides built-in connectors, automatic scaling, and operational tooling. Push/pull queries enable both streaming and interactive analytics. Schema Registry integration provides automatic schema evolution and type safety.

For complex aggregations, Kafka Streams offers custom aggregation functions, multiple state stores, and optimization opportunities through processor API. ksqlDB provides standard SQL aggregations (SUM, COUNT, AVG) with windowing but limited customization for complex business logic.

Performance considerations: Kafka Streams allows fine-tuning through custom state stores, memory management, and processing optimization. ksqlDB abstracts these details but may have overhead for simple operations. Kafka Streams provides better control over resource utilization and scaling patterns.

**Trade-offs**: Development speed (ksqlDB faster) vs customization flexibility (Kafka Streams). SQL familiarity vs programming language expertise requirements. Operational simplicity vs performance optimization opportunities.

**Functional Follow-up Questions**:
- How do you implement custom business logic that's not expressible in standard SQL?
- What's your strategy for migrating from ksqlDB to Kafka Streams for performance optimization?
- How do you handle schema evolution in complex multi-stream join operations?
- How do you implement exactly-once processing guarantees in both Kafka Streams and ksqlDB?

**Non-Functional Follow-up Questions**:
- How do you monitor and debug performance issues in ksqlDB vs Kafka Streams applications?
- What testing strategies ensure correctness of complex stream processing logic?
- How do you handle operational deployment and scaling for both technologies?
- What factors drive the decision between SQL-based and programmatic stream processing?

**Interview Tip**: Demonstrate understanding of when to choose each technology based on specific requirements and team capabilities.

---

## How to Use This Study Guide

**Study Approach**:
- Set up local Kafka clusters to experiment with different configurations
- Implement sample event-driven applications using both Kafka Streams and ksqlDB
- Practice designing partition strategies for different use cases
- Work through failure scenarios and recovery procedures

**Mock Interview Pacing**:
- Define event flow requirements and constraints (5 minutes)
- Design Kafka architecture and partitioning strategy (15 minutes)
- Discuss consumer scaling and ordering guarantees (10 minutes)
- Address monitoring, operations, and failure handling (10 minutes)

**Hands-on Labs**: Create event-driven microservices, implement different partitioning strategies, experiment with consumer group scaling, and practice debugging Kafka performance issues using monitoring tools.