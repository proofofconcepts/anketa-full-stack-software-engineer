# Vote Action - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-frontend-foundation](../adr/ADR-001-frontend-foundation.md)

---

## 1. Overview

This feature enables authenticated vote submission from the web client by sending poll and option identifiers to the backend vote endpoint with a Bearer token.

---

## 2. Goals

- Allow authenticated users to submit a vote from poll options.
- Send correctly structured vote payloads to backend.
- Refresh poll view after successful vote submission.
- Show meaningful error messages on failure.

## 3. Non-Goals

- Full frontend authentication lifecycle and token persistence.
- Vote update and vote removal interactions.
- Optimistic UI with rollback semantics.

---

## 4. Background & Context

Vote action is the first write operation in the frontend and validates contract correctness with backend domain integrity rules, including one-vote-per-user-per-poll behavior.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 Submission Preconditions

- REQ-01 (P0): The frontend MUST require an access token before vote submission.
- REQ-02 (P0): The frontend MUST include the token in the Authorization Bearer header.
- REQ-03 (P0): Vote request payload MUST include `pollId` and `optionId`.

### 5.2 Submission Outcome

- REQ-04 (P0): On successful vote, frontend MUST trigger poll list refresh.
- REQ-05 (P0): On backend error, frontend MUST display an error message.
- REQ-06 (P1): Frontend SHOULD show in-progress state while vote request is pending.

---

## 6. Non-Functional Requirements

- Performance: Vote interactions should complete quickly under expected local conditions.
- Availability: Feature should fail gracefully when backend is unreachable.
- Security: Token should only be used in the request header and not exposed in UI logs.
- Observability: User-visible notices should make failed vote actions diagnosable.
- Scalability: Interaction model should support richer auth/session handling later.

---

## 7. User Stories / Scenarios

```text
As an authenticated user,
I want to vote for a poll option,
So that my choice is recorded by the platform.
```

### Acceptance Criteria

- [ ] Given a valid token and selectable poll option, when vote is clicked, then `POST /v1/votes` is sent.
- [ ] Given successful vote response, when request completes, then polls are refreshed.
- [ ] Given missing token, when vote is clicked, then request is not sent and user sees token-required guidance.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
[PollCard Action] -> [App.tsx handler] -> [api/client.ts submitVote()] -> [POST /v1/votes]
```

### 8.2 Data Model

```ts
interface CreateVotePayload {
  pollId: string;
  optionId: string;
}
```

### 8.3 API Contract

Endpoint:

- `POST /v1/votes`

Request elements:

- Authorization: `Bearer <accessToken>`
- JSON body: `pollId`, `optionId`

### 8.4 Key Flows

Happy path:

1. User provides access token.
2. User clicks poll option.
3. App submits authenticated vote request.
4. App refreshes poll list on success.

Edge cases:

- Missing token blocks request.
- Invalid token returns auth error.
- Duplicate vote returns conflict from backend and displays message.

---

## 9. Error Handling

- Missing token: block request and display local guidance message.
- API validation/auth/domain failures: display backend-provided message when available.
- Network failure: display generic request-failed message.

---

## 10. Open Questions

1. Should token input be replaced with a proper login UI immediately or in a separate iteration?
Owner: @team
Status: Open

2. Should vote button state include per-poll loading indicators instead of global loading state?
Owner: @team
Status: Open

---

## 11. Out of Scope / Future Work

- Persistent session/token storage.
- Undo vote or change vote frontend flows.
- Advanced retry and idempotency UX.

---

## 12. References

- [Frontend overview spec](00-overview-technical-implementation.md)
- [Frontend poll feed spec](01-feature-poll-feed-spec.md)
- [Backend votes spec](../../../backend/docs/specs/04-feature-votes-spec.md)
