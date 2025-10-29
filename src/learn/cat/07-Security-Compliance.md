# Security & Compliance for Principal/Staff Engineers

**One-line summary**: Master authentication, authorization, encryption, and compliance frameworks essential for building secure, auditable systems at enterprise scale.

## Table of Contents
1. [Authentication Architecture](#authentication-architecture)
2. [Authorization & RBAC](#authorization--rbac)
3. [Data Encryption](#data-encryption)
4. [API Security](#api-security)
5. [Audit Trails & Compliance](#audit-trails--compliance)
6. [Secret Management](#secret-management)
7. [Network Security](#network-security)
8. [Vulnerability Management](#vulnerability-management)
9. [Privacy & Data Protection](#privacy--data-protection)
10. [Security Monitoring](#security-monitoring)
11. [Incident Response](#incident-response)
12. [Compliance Frameworks](#compliance-frameworks)

---

## Authentication Architecture

### Q1: Design an authentication system for a multi-tenant SaaS platform supporting SSO, MFA, and API access with 10M+ users across enterprise and consumer segments.

**Summary**: Implement OAuth2/OIDC federation with JWT tokens, multi-factor authentication, tenant isolation, and scalable session management to support diverse authentication requirements while maintaining security and performance.

**Deep Answer**:
Design OAuth2/OIDC architecture using identity providers (Auth0, Keycloak, AWS Cognito) with tenant-specific configuration supporting SAML, LDAP, and social login providers. Implement JWT token architecture with short-lived access tokens (15 minutes) and longer-lived refresh tokens (7 days) with secure rotation policies.

Deploy multi-factor authentication supporting TOTP, SMS, hardware tokens, and biometric authentication with risk-based adaptive authentication. Implement device trust and geo-location analysis to reduce MFA friction for trusted environments while maintaining security for suspicious access patterns.

Implement tenant isolation through token namespacing and audience validation. Use tenant-specific signing keys for JWT tokens to prevent cross-tenant token abuse. Deploy rate limiting per tenant and user to prevent brute force attacks and resource exhaustion.

Design session management with distributed session storage (Redis Cluster) supporting horizontal scaling and cross-region replication. Implement secure session invalidation, concurrent session limits, and suspicious activity detection with automatic session termination.

**Trade-offs**: Authentication latency (100-300ms) vs security verification depth. Token storage overhead vs stateless scalability. MFA user experience vs security requirements.

**Functional Follow-up Questions**:
- How do you handle authentication during identity provider outages without compromising security?
- What's your strategy for migrating users between authentication providers during acquisitions?
- How do you implement step-up authentication for sensitive operations within applications?
- How do you handle authentication for mobile applications with intermittent connectivity?

**Non-Functional Follow-up Questions**:
- How do you ensure authentication systems meet performance SLAs during peak load?
- What strategies prevent authentication bottlenecks from impacting application availability?
- How do you validate authentication security without exposing vulnerabilities during testing?
- What's your approach for authentication system disaster recovery and failover?

**Interview Tip**: Emphasize understanding of authentication scalability challenges and tenant security isolation requirements.

---

## Authorization & RBAC

### Q2: Design a fine-grained authorization system for a healthcare platform requiring role-based access control, attribute-based permissions, and audit compliance with HIPAA requirements.

**Summary**: Implement hierarchical RBAC with attribute-based access control (ABAC), policy engines, and comprehensive audit logging to ensure healthcare data access compliance while maintaining system performance and usability.

**Deep Answer**:
Design hierarchical RBAC structure with roles (Doctor, Nurse, Administrator), permissions (read_patient_data, write_prescription), and resources (patient records, medical images) with inheritance patterns. Implement role hierarchies where senior roles inherit junior permissions while adding specialized access rights.

Deploy attribute-based access control (ABAC) using policy engines (Open Policy Agent, AWS Cedar) for complex access decisions based on user attributes, resource properties, environmental context, and time-based constraints. Example: "Doctors can access patient records for patients under their care during business hours."

Implement policy decision points (PDP) with caching for performance optimization and policy enforcement points (PEP) at application boundaries. Use distributed policy caching with invalidation strategies to balance access decision latency (target <10ms) with policy consistency requirements.

Design comprehensive audit logging capturing all access decisions, policy evaluations, and administrative changes. Implement immutable audit trails with cryptographic integrity protection, automatic retention management, and HIPAA-compliant audit reporting capabilities.

**Trade-offs**: Authorization decision latency vs granular access control. Policy complexity vs maintenance overhead. Audit logging volume vs compliance requirements.

**Functional Follow-up Questions**:
- How do you handle emergency access scenarios where normal authorization rules need bypassing?
- What's your strategy for managing role assignments during staff transitions and department changes?
- How do you implement time-based access controls for temporary staff or consultants?
- How do you handle authorization for batch processing and automated systems?

**Non-Functional Follow-up Questions**:
- How do you ensure authorization decisions remain consistent during policy updates?
- What strategies prevent authorization systems from becoming performance bottlenecks?
- How do you validate authorization correctness without exposing sensitive access patterns?
- What's your approach for authorization system testing and policy validation?

**Interview Tip**: Show understanding of healthcare compliance requirements and the balance between security and operational efficiency.

---

## Data Encryption

### Q3: Design an encryption strategy for a financial services platform handling PCI DSS requirements with key rotation, performance optimization, and regulatory compliance across multiple jurisdictions.

**Summary**: Implement multi-layered encryption with HSM key management, transparent database encryption, application-level field encryption, and automated key rotation while maintaining query performance and compliance auditability.

**Deep Answer**:
Design layered encryption architecture: transparent data encryption (TDE) for databases, application-level field encryption for PII/PCI data, and transport encryption for all network communication. Use AES-256 for symmetric encryption and RSA-2048/ECDSA-P256 for asymmetric operations with FIPS 140-2 Level 3 HSMs for key protection.

Implement hierarchical key management with master keys in HSMs, data encryption keys (DEK) encrypted by key encryption keys (KEK), and automated key rotation policies. Use envelope encryption patterns: encrypt data with DEK, encrypt DEK with KEK, store encrypted DEK with data for performance optimization.

Deploy field-level encryption for sensitive data (credit card numbers, SSNs) using deterministic encryption for equality searches and format-preserving encryption (FPE) for legacy system compatibility. Implement tokenization for external data sharing with vault-less token generation for performance.

Design cross-jurisdictional key management supporting data residency requirements: EU keys stored in EU regions, US keys in US regions, with secure key replication for disaster recovery within regulatory boundaries. Implement automated compliance reporting for key usage, rotation, and access patterns.

**Trade-offs**: Encryption performance overhead (10-20% CPU) vs regulatory compliance. Key management complexity vs security requirements. Query functionality limitations vs data protection levels.

**Functional Follow-up Questions**:
- How do you handle encryption key escrow requirements for law enforcement access?
- What's your strategy for encrypting data in legacy systems that don't support modern encryption?
- How do you implement encryption for real-time fraud detection systems requiring fast access?
- How do you handle encryption during data migrations and system integrations?

**Non-Functional Follow-up Questions**:
- How do you ensure encryption implementations meet performance SLAs for transaction processing?
- What strategies prevent encryption keys from becoming single points of failure?
- How do you validate encryption effectiveness without exposing cryptographic weaknesses?
- What's your approach for encryption compliance auditing and regulatory reporting?

**Interview Tip**: Demonstrate understanding of encryption performance impact and regulatory compliance complexity.

---

## API Security

### Q4: Secure APIs for a public platform expecting 100K+ third-party developers with rate limiting, threat detection, and data access controls.

**Summary**: Implement comprehensive API security with OAuth2 scopes, rate limiting, threat detection, input validation, and developer lifecycle management to protect against abuse while enabling ecosystem growth.

**Deep Answer**:
Design API security architecture using OAuth2 with fine-grained scopes for access control, API keys for developer identification, and JWT tokens for stateless authentication. Implement client credentials flow for server-to-server communication and authorization code flow for user-delegated access.

Deploy multi-tier rate limiting: global limits per API key, per-endpoint limits, and burst capacity with sliding window algorithms. Implement rate limiting storage using Redis with distributed coordination across API gateway instances. Use 429 status codes with retry-after headers for client guidance.

Implement threat detection using behavioral analysis: detect unusual request patterns, identify potential scrapers through request fingerprinting, and block suspicious IP addresses using dynamic blacklisting. Deploy OWASP API Security Top 10 protections including injection prevention and excessive data exposure controls.

Design input validation with schema-based request validation, output filtering based on OAuth scopes, and comprehensive audit logging of API usage patterns. Implement API versioning strategies supporting backward compatibility while enabling security improvements.

**Trade-offs**: Security friction vs developer experience. Rate limiting strictness vs legitimate high-volume usage. Threat detection sensitivity vs false positive rates.

**Functional Follow-up Questions**:
- How do you handle API security during developer onboarding and key provisioning?
- What's your strategy for API versioning when security vulnerabilities are discovered?
- How do you implement API security for webhook endpoints and callback URLs?
- How do you handle API access for mobile applications with varying security capabilities?

**Non-Functional Follow-up Questions**:
- How do you ensure API security measures don't impact legitimate developer productivity?
- What strategies prevent API security systems from becoming availability bottlenecks?
- How do you validate API security effectiveness without exposing attack vectors?
- What's your approach for API security monitoring and threat intelligence integration?

**Interview Tip**: Show understanding of developer ecosystem needs balanced with security requirements.

---

## Audit Trails & Compliance

### Q5: Design an audit trail system for a regulated financial platform requiring SOX compliance, immutable logging, and real-time compliance monitoring.

**Summary**: Implement immutable audit logging with cryptographic integrity, real-time compliance monitoring, automated reporting, and secure long-term retention to meet regulatory requirements while supporting operational efficiency.

**Deep Answer**:
Design immutable audit trail architecture using append-only storage with cryptographic hash chains preventing tampering. Implement audit event standardization with consistent schema including actor, action, resource, timestamp, and context attributes following CloudEvents or similar standards.

Deploy real-time audit processing using event streaming (Kafka) with compliance rule engines detecting violations immediately. Implement automated compliance monitoring for segregation of duties, approval workflows, and access pattern anomalies with configurable business rules.

Implement secure long-term retention using encrypted storage with WORM (Write Once, Read Many) characteristics. Design audit data lifecycle management with automated archival, legal hold capabilities, and secure deletion after retention periods while maintaining compliance requirements.

Design comprehensive audit reporting with automated SOX compliance reports, access certification workflows, and regulatory filing support. Implement audit data analytics for fraud detection, insider threat identification, and operational risk management.

**Trade-offs**: Audit data volume vs storage costs. Real-time processing overhead vs compliance timeliness. Audit detail level vs system performance impact.

**Functional Follow-up Questions**:
- How do you handle audit trail continuity during system maintenance and upgrades?
- What's your strategy for audit data correlation across multiple systems and vendors?
- How do you implement audit trails for batch processing and automated system actions?
- How do you handle audit requirements for emergency access and break-glass scenarios?

**Non-Functional Follow-up Questions**:
- How do you ensure audit systems maintain availability during compliance audits?
- What strategies prevent audit logging from impacting transaction processing performance?
- How do you validate audit trail completeness and integrity for regulatory examinations?
- What's your approach for audit system disaster recovery and cross-region compliance?

**Interview Tip**: Emphasize understanding of regulatory requirements and the operational impact of comprehensive audit systems.

---

## Secret Management

### Q6: Design a secrets management system for a microservices platform with 200+ services requiring secure distribution, rotation, and access control.

**Summary**: Implement centralized secret management with automated rotation, just-in-time access, service identity verification, and comprehensive audit logging to secure credentials across distributed architecture.

**Deep Answer**:
Design centralized secrets management using HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault with high availability clustering and automated backup. Implement secret engines supporting databases, cloud providers, and custom applications with automated credential generation and rotation.

Deploy service identity and authentication using service accounts, mTLS certificates, or cloud IAM roles for secret access authorization. Implement just-in-time (JIT) secret provisioning where secrets are generated dynamically upon request with short TTLs (15 minutes to 1 hour) reducing exposure window.

Implement automated secret rotation with coordination between secret management system and consuming applications. Design rotation workflows supporting zero-downtime updates through blue-green credential switching and application-level secret refresh mechanisms.

Design secret distribution using init containers, sidecar patterns, or secret operators (Kubernetes) for secure injection into application runtime. Implement secret caching with appropriate TTL and invalidation strategies balancing performance with security requirements.

**Trade-offs**: Secret access latency vs security verification depth. Centralization benefits vs system dependencies. Automated rotation complexity vs manual security processes.

**Functional Follow-up Questions**:
- How do you handle secret distribution during network partitions or secret management system outages?
- What's your strategy for emergency secret access when automated systems are unavailable?
- How do you implement secret sharing for services that require coordinated access to shared resources?
- How do you handle secret migration during service refactoring or infrastructure changes?

**Non-Functional Follow-up Questions**:
- How do you ensure secret management doesn't become a single point of failure for applications?
- What strategies prevent secret management latency from impacting application startup times?
- How do you validate secret security without exposing credentials during testing?
- What's your approach for secret management compliance and audit requirements?

**Interview Tip**: Show understanding of secret management operational challenges and the balance between security and system reliability.

---

## How to Use This Study Guide

**Study Approach**:
- Study major compliance frameworks (SOX, HIPAA, PCI DSS, GDPR) and their technical requirements
- Practice implementing authentication and authorization systems using industry-standard tools
- Work through security threat modeling exercises for distributed systems
- Understand cryptographic principles and key management best practices

**Mock Interview Pacing**:
- Identify security and compliance requirements (5 minutes)
- Design security architecture and controls (15 minutes)
- Discuss threat mitigation and monitoring strategies (10 minutes)
- Address compliance and audit considerations (10 minutes)

**Hands-on Practice**: Implement OAuth2/OIDC flows, set up secret management systems, practice encryption key management, and work through compliance audit scenarios using real security tools and frameworks.