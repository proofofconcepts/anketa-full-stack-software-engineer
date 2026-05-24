# Vote Submission - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-nestjs-modular-architecture](../adr/ADR-001-nestjs-modular-architecture.md), [ADR-003-prisma-postgresql](../adr/ADR-003-prisma-postgresql.md)

---

## 1. Overview

This feature allows authenticated users to submit votes on polls while enforcing strict one-vote-per-user-per-poll integrity through validation and database constraints.

---

## 2. Goals

- Provide a secure vote submission endpoint for authenticated users.
- Validate poll and option consistency before persisting votes.
- Enforce one vote per user per poll with deterministic conflict behavior.
- Keep vote errors predictable for client handling.

## 3. Non-Goals

- Vote updates or vote removal workflows.
- Anonymous voting modes.
- Complex anti-fraud and abuse-detection systems.

---

## 4. Background & Context

Voting is the platform's core action and must protect integrity above all else. The backend enforces ownership and domain constraints with both service-level checks and database-level uniqueness guarantees.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 Vote Endpoint

- REQ-01 (P0): The system MUST expose `POST /v1/votes` as an authenticated endpoint.
- REQ-02 (P0): Vote requests MUST include valid `pollId` and `optionId` payload fields.
- REQ-03 (P0): The service MUST verify poll existence before creating a vote.
- REQ-04 (P0): The service MUST verify the selected option belongs to the target poll.

### 5.2 Integrity Enforcement

- REQ-05 (P0): The system MUST persist valid vote records.
- REQ-06 (P0): The system MUST enforce one vote per user per poll via database uniqueness.
- REQ-07 (P1): Duplicate vote attempts SHOULD return domain conflict semantics for clients.

---

## 6. Non-Functional Requirements

- Performance: Vote submission should remain responsive under expected local load.
- Availability: Vote endpoint should be available while API and database are healthy.
- Security: Only authenticated users may submit votes.
- Observability: Vote requests and failures must emit structured logs.
- Scalability: Vote model should support growing poll participation without semantic drift.

---

## 7. User Stories / Scenarios

```text
As an authenticated user,
I want to cast one vote on a poll option,
So that the platform can reflect my choice with integrity.
```

### Acceptance Criteria

- [ ] Given a valid token and valid option in a poll, when vote is submitted, then status 201 is returned.
- [ ] Given the user already voted in the poll, when voting again, then status 409 is returned.
- [ ] Given an option from a different poll, when vote is submitted, then status 404 is returned.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
[Client] -> [/v1/votes Controller] -> [Votes Service] -> [Prisma Vote]
                                   -> [Poll + Option validation]
```

### 8.2 Data Model

```ts
interface Vote {
  userId: string;
  pollId: string;
  optionId: string;
}
```

Integrity rule:

- Unique constraint: `Vote @@unique([userId, pollId])`.

### 8.3 API Contract

Endpoint:

- `POST /v1/votes` (JWT required)

Request payload includes:

- `pollId`
- `optionId`

### 8.4 Key Flows

Happy path:

1. Authenticated user submits vote payload.
2. Service validates poll existence.
3. Service validates option ownership under poll.
4. Vote is persisted.
5. Created response is returned.

Edge cases:

- Missing or invalid token returns unauthorized.
- Missing poll or invalid option for poll returns not found.
- Duplicate vote attempt returns conflict.

---

## 9. Error Handling

- Missing or invalid token: return unauthorized error.
- Poll does not exist: return not found error.
- Option not in target poll: return not found error.
- Duplicate vote in same poll by same user: return conflict error.

---

## 10. Open Questions

1. Should users be able to change votes in a future iteration?
Owner: @team
Status: Open

2. Should vote submission support idempotency keys for client retries?
Owner: @team
Status: Open

---

## 11. Out of Scope / Future Work

- Vote change and vote withdrawal flows.
- Anonymous voting options.
- Advanced anti-abuse controls and anomaly detection.

---

## 12. References

- [Backend overview spec](00-overview-technical-implementation.md)
- [Polls feature spec](03-feature-polls-spec.md)
- [Backend OpenAPI contract](../../openapi/anketa-social-vote.openapi.yaml)
