# System Design for Principal/Staff Engineers

**One-line summary**: Master large-scale distributed system architecture, design patterns, and trade-offs essential for senior engineering leadership roles.

## Table of Contents
1. [Scalability Fundamentals](#scalability-fundamentals)
2. [Load Balancing & Traffic Distribution](#load-balancing--traffic-distribution)
3. [Data Partitioning & Sharding](#data-partitioning--sharding)
4. [Consistency Models & CAP Theorem](#consistency-models--cap-theorem)
5. [Multi-Region Architecture](#multi-region-architecture)
6. [Caching Strategies](#caching-strategies)
7. [API Gateway Patterns](#api-gateway-patterns)
8. [Microservices Decomposition](#microservices-decomposition)
9. [Event-Driven Architecture](#event-driven-architecture)
10. [Capacity Planning & Scaling](#capacity-planning--scaling)
11. [Disaster Recovery & Failover](#disaster-recovery--failover)
12. [Advanced Architecture Patterns](#advanced-architecture-patterns)

---

## Scalability Fundamentals

### Q1: How do you design a system to handle 100K requests per second with strict latency requirements (p99 < 50ms)?

**Summary**: Design requires horizontal scaling with load balancing, caching layers, asynchronous processing, and careful resource allocation to maintain sub-50ms response times at scale.

**Deep Answer**: 
Achieving 100K RPS with p99 < 50ms requires a multi-layered approach. First, implement horizontal scaling with load balancers distributing traffic across multiple application instances. Use connection pooling and keep-alive connections to minimize connection overhead. Deploy CDN for static content and implement multi-tier caching (L1: in-memory, L2: Redis cluster, L3: database query cache).

For the application layer, use non-blocking I/O with reactive programming models (WebFlux, Vert.x) or async frameworks. Implement circuit breakers to prevent cascade failures and use bulkheads to isolate critical resources. Database operations should leverage read replicas, connection pooling, and prepared statements. Consider database sharding if single-instance limits are reached.

Monitor key metrics: request latency distribution, CPU/memory utilization, garbage collection pauses, and database connection pool usage. Implement proper request routing to ensure even load distribution. Use async processing for non-critical operations and implement graceful degradation for secondary features during peak load.

**Trade-offs**: Higher infrastructure costs vs. performance guarantees. Complexity increases with caching layers (cache invalidation challenges). Eventual consistency models may be needed for global scale. Memory overhead from connection pools and caching.

**Functional Follow-up Questions**: 
- How would you handle traffic spikes that exceed 150K RPS?
- What's your strategy for maintaining performance during database failover?
- How do you implement graceful degradation when downstream services are unavailable?
- What's your approach for handling geographic traffic distribution during regional outages?

**Non-Functional Follow-up Questions**:
- How do you validate that your optimizations maintain security standards?
- What monitoring ensures SLA compliance during traffic spikes?
- How do you balance optimization costs vs performance benefits?
- What's your rollback strategy if performance optimizations cause stability issues?

**Interview Tip**: Demonstrate understanding of the full request lifecycle and show how each optimization addresses specific bottlenecks.

---

## Load Balancing & Traffic Distribution

### Q2: Design a load balancing strategy for a microservices architecture with services having different resource requirements and SLA commitments.

**Summary**: Implement intelligent routing with service-aware load balancing, health checks, circuit breakers, and SLA-based traffic prioritization to optimize resource utilization across heterogeneous services.

**Deep Answer**:
Design a multi-tier load balancing strategy starting with a global load balancer (GLB) for geographic distribution, followed by service-specific load balancers. Implement weighted round-robin with dynamic weight adjustment based on real-time metrics (CPU, memory, response time, active connections).

For heterogeneous services, use resource-aware routing where compute-intensive services get routed to high-CPU instances, while I/O-bound services utilize instances with faster storage. Implement priority queues with SLA-based traffic classification: premium services get dedicated capacity and preferential routing during contention.

Deploy health checks at multiple levels: TCP for basic connectivity, HTTP for application readiness, and custom health endpoints for business logic validation. Implement gradual traffic shifting for deployments using canary releases with automatic rollback on error rate thresholds.

Use consistent hashing for stateful services to maintain session affinity while enabling horizontal scaling. Implement request-level metrics collection for traffic pattern analysis and predictive scaling decisions.

**Trade-offs**: Increased complexity vs. optimized resource utilization. Additional latency from health checks vs. reliability. Memory overhead for connection tracking and metrics collection.

**Functional Follow-up Questions**:
- How do you handle load balancer failures in this architecture?
- What metrics drive your dynamic weight adjustment algorithm?
- How do you implement sticky sessions for stateful services in your load balancing strategy?
- What's your approach for routing traffic during service deployments?

**Non-Functional Follow-up Questions**:
- How do you ensure load balancing decisions maintain security isolation between tenant types?
- What monitoring validates that SLA-based routing actually improves business metrics?
- How do you test load balancing behavior under various failure scenarios?
- What's your strategy for load balancer configuration management across environments?

**Interview Tip**: Show understanding of service heterogeneity and business impact of different SLA tiers.

---

## Data Partitioning & Sharding

### Q3: Design a sharding strategy for a global e-commerce platform handling 1M orders per day with geographic distribution requirements.

**Summary**: Implement hybrid sharding using geographic and hash-based partitioning with cross-shard query optimization, automatic rebalancing, and data locality principles for optimal performance.

**Deep Answer**:
Design a two-level sharding strategy combining geographic and functional partitioning. Primary partition by region (US, EU, APAC) to ensure data locality and compliance with regional regulations. Within each region, implement hash-based sharding on user_id for user data and order_id for transactional data.

For 1M orders/day (~12 orders/second average, ~120 orders/second peak), plan for 10x capacity (1200 orders/second). With 4KB average order size, daily storage is ~4GB. Plan for 1000x retention (10 years), requiring ~4TB per region. Implement consistent hashing with virtual nodes to enable seamless rebalancing.

Handle cross-shard queries using federated query patterns or materialized views for common access patterns. Implement distributed transactions using saga patterns for order workflows spanning multiple shards. Use read replicas within each shard for analytics workloads.

Deploy automatic rebalancing triggered by storage thresholds (80% capacity) or performance metrics (p95 latency > 100ms). Implement shadow traffic during rebalancing to validate new shard assignments before switching production traffic.

**Trade-offs**: Query complexity increases for cross-shard operations. Rebalancing requires careful coordination. Hot spots possible with uneven geographic distribution. Additional infrastructure costs for distributed coordination.

**Follow-up Questions**:
- How do you handle hotspots during flash sales in specific regions?
- What's your strategy for maintaining ACID properties across shards?

**Interview Tip**: Demonstrate capacity planning skills with concrete calculations and show awareness of operational complexity.

---

## Consistency Models & CAP Theorem

### Q4: Explain how you would implement eventual consistency for a global inventory management system while ensuring no overselling occurs.

**Summary**: Use strong consistency for inventory decrements with compensation patterns, eventual consistency for reads, and distributed locking with timeout-based cleanup to prevent overselling in a globally distributed system.

**Deep Answer**:
Implement a hybrid consistency model where inventory decrements require strong consistency while reads can be eventually consistent. Use distributed consensus (Raft/Multi-Paxos) for inventory write operations with a quorum-based approach requiring majority acknowledgment before confirming stock reduction.

Design a reservation-based system where purchase attempts create temporary reservations with TTL (5-10 minutes). Reservations immediately decrement available inventory using strong consistency, while actual purchase completion uses saga patterns to either confirm or release reservations. This prevents overselling while allowing for shopping cart abandonment.

For global distribution, implement master-slave replication per region with async replication for read queries. Use vector clocks or logical timestamps to handle concurrent updates. Implement conflict resolution using business rules (last-writer-wins for inventory increases, sum for concurrent decrements up to available stock).

Deploy compensation mechanisms for failed transactions: if payment fails after inventory decrement, automatically trigger inventory restoration. Use event sourcing to maintain audit trails of all inventory operations for regulatory compliance and debugging.

**Trade-offs**: Higher latency for write operations due to consensus requirements. Increased storage overhead for reservation tracking. Complexity in handling network partitions and partial failures. Potential for temporary stock unavailability during reservation periods.

**Follow-up Questions**:
- How do you handle network partitions in critical inventory regions?
- What happens when consensus nodes become unavailable during high-traffic periods?

**Interview Tip**: Show deep understanding of consistency guarantees and business impact of different trade-offs.

---

## Multi-Region Architecture

### Q5: Design a multi-region deployment for a financial services platform requiring 99.99% availability with strict data residency requirements.

**Summary**: Implement active-active multi-region architecture with region-specific data isolation, cross-region disaster recovery, automated failover mechanisms, and compliance-aware data routing to achieve high availability while meeting regulatory requirements.

**Deep Answer**:
Design an active-active multi-region architecture with dedicated data centers in required jurisdictions (US, EU, APAC). Each region operates independently with complete application stacks and region-specific data stores to satisfy data residency requirements. Implement intelligent DNS-based routing directing users to their home region with health-check-based failover.

For 99.99% availability (52.56 minutes downtime/year), implement automated failover with health checks every 30 seconds and failover completion within 2 minutes. Use circuit breakers to isolate failing components and graceful degradation for non-critical features. Deploy blue-green deployments within each region to minimize deployment-related downtime.

Implement data synchronization for shared reference data (exchange rates, regulatory parameters) using event-driven replication with conflict resolution. Critical financial transactions remain region-locked, while read-only queries can leverage cross-region read replicas with appropriate data classification.

Deploy chaos engineering practices to regularly test failover scenarios. Use synthetic monitoring to detect issues before customer impact. Implement runbook automation for common failure scenarios to reduce mean time to recovery (MTTR).

**Trade-offs**: Significantly higher infrastructure costs (3x minimum). Increased complexity for cross-region operations. Potential data inconsistencies during network partitions. Regulatory complexity for emergency cross-region access.

**Follow-up Questions**:
- How do you handle regulatory audits across multiple jurisdictions?
- What's your strategy for cross-region disaster recovery testing?

**Interview Tip**: Emphasize regulatory awareness and operational excellence in failure scenarios.

---

## How to Use This Study Guide

**Study Approach**: 
- Spend 1 hour daily focusing on 2-3 questions per topic
- Practice drawing architecture diagrams for each scenario
- Time yourself: 5 minutes for summary, 15 minutes for detailed explanation
- Create flashcards for key trade-offs and failure modes

**Mock Interview Pacing**:
- Start with high-level design (10 minutes)
- Deep dive into 2-3 components (20 minutes)  
- Discuss trade-offs and alternatives (10 minutes)
- Address scalability and failure scenarios (15 minutes)

**Focus Areas**: Master the fundamentals first, then tackle advanced scenarios. Practice capacity planning calculations and be ready to defend architectural decisions with concrete metrics.