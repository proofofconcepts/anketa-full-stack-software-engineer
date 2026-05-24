# Backend API Foundation - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-nestjs-modular-architecture](../adr/ADR-001-nestjs-modular-architecture.md), [ADR-002-openapi-first](../adr/ADR-002-openapi-first.md), [ADR-003-prisma-postgresql](../adr/ADR-003-prisma-postgresql.md), [ADR-004-jwt-refresh-rotation](../adr/ADR-004-jwt-refresh-rotation.md), [ADR-005-structured-observability-logging](../adr/ADR-005-structured-observability-logging.md)

---

## 1. Overview

This spec defines the current backend API foundation for the social vote platform, including architecture, security, data integrity, observability, and API contract alignment, so implementation remains consistent, reviewable, and extensible for upcoming frontend and mobile integrations.

---

## 2. Goals

- Establish a stable, modular backend architecture for auth, polls, and voting.
- Preserve data integrity constraints for users, votes, polls, and refresh tokens.
- Keep the API contract documented and aligned with implementation.
- Ensure baseline security and observability are implemented consistently.
- Enable frontend and mobile clients to integrate against predictable endpoints.

## 3. Non-Goals

- Defining final product UX or client-side interaction patterns.
- Introducing advanced moderation, recommendation, or social feed features.
- Covering all long-term scaling patterns beyond the current implementation scope.

---

## 4. Background & Context

The project is an interview-focused full-stack study repository with a backend-first delivery strategy. The backend currently implements core domain capabilities and engineering standards expected by the target role, including NestJS modular architecture, Prisma-backed relational modeling, OpenAPI documentation, JWT auth with refresh rotation, and structured logging.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 API Foundation

- REQ-01 (P0): The backend MUST expose all API routes under the /v1 global prefix.
- REQ-02 (P0): The backend MUST provide health, auth, poll, and vote capabilities.
- REQ-03 (P1): The backend SHOULD keep contracts synchronized with the OpenAPI document.

### 5.2 Validation, Auth, and Integrity

- REQ-04 (P0): The backend MUST validate request payloads using DTO-driven validation.
- REQ-05 (P0): Protected routes MUST require valid JWT access tokens.
- REQ-06 (P0): The system MUST enforce one vote per user per poll in the database.
- REQ-07 (P0): Refresh token flows MUST support rotation and revocation behavior.

### 5.3 Observability and Error Contracts

- REQ-08 (P0): The backend MUST emit structured request logs for each request lifecycle.
- REQ-09 (P0): The backend MUST emit structured error logs via global exception handling.
- REQ-10 (P1): Responses SHOULD include request correlation metadata for troubleshooting.

---

## 6. Non-Functional Requirements

| Category      | Requirement                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| Performance   | Core routes should remain responsive under expected local development load. |
| Availability  | Service should provide reliable local startup and health reporting.         |
| Security      | Credentials and tokens must be protected and validated end-to-end.          |
| Observability | Key flows must emit structured logs with request context.                   |
| Scalability   | Modular design should support adding new domains without major refactors.   |

---

## 7. User Stories / Scenarios

```text
As an API consumer,
I want predictable auth, poll, and vote endpoints,
So that I can integrate client applications safely and efficiently.
```

### Acceptance Criteria

- [ ] Given the API is running, when a request is sent to /v1/health, then status ok is returned.
- [ ] Given valid credentials, when login succeeds, then access and refresh tokens are returned.
- [ ] Given a user already voted in a poll, when voting again in that same poll, then the request is rejected.
- [ ] Given an invalid payload, when it is submitted to a validated endpoint, then a validation error is returned.

---

## 8. Technical Design

### 8.1 High-Level Architecture

Backend composition:

```text
[Client] -> [/v1 Routes] -> [Nest Modules: Auth, Polls, Votes]
                        -> [Prisma Service] -> [PostgreSQL]
                        -> [Structured Logs / Exception Filter]
```

### 8.2 Data Model

```ts
interface User {
  id: string;
  email: string;
}

interface Vote {
  userId: string;
  pollId: string;
  optionId: string;
}
```

Key constraints:

- User email is unique.
- Vote has a unique key on userId + pollId.
- Refresh token hash is unique.
- Relations use cascading deletes.

### 8.3 API Contract

See full OpenAPI contract at: openapi/anketa-social-vote.openapi.yaml

Current implemented areas include:

- Health endpoint
- Auth endpoints for register, login, and refresh
- Poll listing and management endpoints
- Vote submission endpoint

### 8.4 Key Flows

Main request flow:

1. Request enters /v1 controller route.
2. Validation pipe enforces DTO schema and strips unknown fields.
3. JWT guard validates protected endpoints.
4. Service executes domain logic and Prisma operations.
5. Response is returned with request tracing metadata.
6. Structured request and error logging capture operational context.

Edge conditions:

- Duplicate vote attempts are rejected.
- Invalid or revoked refresh tokens are rejected.
- Non-whitelisted payload fields are rejected by validation policy.

---

## 9. Error Handling

| Scenario                | Behavior                                                  | HTTP Status |
| ----------------------- | --------------------------------------------------------- | ----------- |
| Invalid input           | Return validation error with normalized response payload. | 400         |
| Unauthorized access     | Return auth error for missing or invalid token.           | 401         |
| Forbidden action        | Return forbidden response for ownership violations.       | 403         |
| Resource not found      | Return not found for missing resource identifier.         | 404         |
| Duplicate vote conflict | Return domain conflict for repeated poll vote.            | 409         |

---

## 10. Open Questions

1. Should poll deletion be added or expanded in the OpenAPI contract immediately?
Owner: @team
Status: Open

2. What latency and throughput SLO should be set for backend milestones?
Owner: @team
Status: Open

---

## 11. Out of Scope / Future Work

- Advanced moderation and governance workflows.
- Rich social interaction features beyond current voting scope.
- Production-grade autoscaling and multi-region operational strategy.

---

## 12. References

- [Backend CLAUDE guidance](../../../CLAUDE.md)
- [Backend OpenAPI contract](../../openapi/anketa-social-vote.openapi.yaml)
- [Auth feature spec](01-feature-auth-spec.md)
- [Polls feature spec](03-feature-polls-spec.md)
- [Votes feature spec](04-feature-votes-spec.md)
