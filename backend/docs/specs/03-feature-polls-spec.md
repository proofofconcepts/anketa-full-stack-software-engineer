# Poll Management - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-nestjs-modular-architecture](../adr/ADR-001-nestjs-modular-architecture.md), [ADR-002-openapi-first](../adr/ADR-002-openapi-first.md), [ADR-003-prisma-postgresql](../adr/ADR-003-prisma-postgresql.md)

---

## 1. Overview

This feature defines public poll listing and authenticated poll management operations so users can discover polls, create new polls, and delete polls they own.

---

## 2. Goals

- Provide a public endpoint for reading current polls.
- Allow authenticated users to create polls with valid options.
- Enforce ownership rules on poll deletion.
- Keep poll responses consistent for client consumption.

## 3. Non-Goals

- Rich filtering, search, and ranking algorithms.
- Poll editing/versioning workflows.
- Complex moderation and governance actions.

---

## 4. Background & Context

Polls are a core domain object of the social vote platform. The current backend includes listing, creation, and deletion behaviors designed for correctness first, with ownership and validation rules in place before frontend and mobile expansion.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 List Polls

- REQ-01 (P0): The system MUST expose `GET /v1/polls` as a public endpoint.
- REQ-02 (P0): Poll listing MUST return latest polls in descending creation order.
- REQ-03 (P1): Poll listing SHOULD include option data and vote count summary.
- REQ-04 (P1): Poll listing SHOULD enforce a bounded result size.

### 5.2 Create Poll

- REQ-05 (P0): The system MUST expose `POST /v1/polls` as an authenticated endpoint.
- REQ-06 (P0): Poll creation payload MUST include question and at least two options.
- REQ-07 (P0): Successful poll creation MUST persist poll and option records.

### 5.3 Delete Poll

- REQ-08 (P0): The system MUST expose `DELETE /v1/polls/:pollId` as an authenticated endpoint.
- REQ-09 (P0): Poll deletion MUST only be allowed for the poll owner.
- REQ-10 (P1): Successful deletion SHOULD return `{ deleted: true }`.

---

## 6. Non-Functional Requirements

- Performance: Poll list and mutation endpoints should remain responsive under normal local usage.
- Availability: Poll operations should be available while API and database are healthy.
- Security: Auth guards and ownership checks must be consistently enforced.
- Observability: Poll route calls and failures must emit structured logs.
- Scalability: Poll data model should support growth of poll and option volume.

---

## 7. User Stories / Scenarios

```text
As a user,
I want to browse and manage polls,
So that I can create questions and participate in transparent voting.
```

### Acceptance Criteria

- [ ] Given polls exist, when a client calls `GET /v1/polls`, then status 200 and latest polls are returned.
- [ ] Given a valid token and payload, when a client calls `POST /v1/polls`, then status 201 and persisted poll data are returned.
- [ ] Given a non-owner token, when delete is attempted on another user's poll, then status 403 is returned.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
[Client] -> [/v1/polls Controller] -> [Polls Service] -> [Prisma Poll + PollOption]
```

### 8.2 Data Model

```ts
interface Poll {
  id: string;
  question: string;
  createdById: string;
}

interface PollOption {
  id: string;
  pollId: string;
  label: string;
}
```

### 8.3 API Contract

Endpoints:

- `GET /v1/polls`
- `POST /v1/polls` (JWT required)
- `DELETE /v1/polls/:pollId` (JWT required)

Core response concerns:

- Poll list includes options and vote summary metadata.
- Delete success returns a boolean deletion acknowledgment.

### 8.4 Key Flows

Happy path:

1. Public client retrieves poll list.
2. Authenticated user creates poll with valid options.
3. Owner can delete their own poll.

Edge cases:

- Missing or invalid token on private endpoints returns unauthorized.
- Non-owner delete request returns forbidden.
- Missing poll id target returns not found.

---

## 9. Error Handling

- Unauthorized access on private routes: return auth error.
- Forbidden deletion by non-owner: return forbidden error.
- Missing poll resource: return not found error.
- Validation failures: return normalized bad-request payload.

---

## 10. Open Questions

1. Should list pagination replace the current fixed limit strategy?
Owner: @team
Status: Open

2. Should poll deletion be soft-delete for auditability in later iterations?
Owner: @team
Status: Open

---

## 11. Out of Scope / Future Work

- Poll editing and option mutation after creation.
- Search, tags, and recommendation ranking.
- Moderation queues and reporting workflows.

---

## 12. References

- [Backend overview spec](00-overview-technical-implementation.md)
- [Auth feature spec](02-feature-auth-spec.md)
- [Votes feature spec](04-feature-votes-spec.md)
- [Backend OpenAPI contract](../../openapi/anketa-social-vote.openapi.yaml)
