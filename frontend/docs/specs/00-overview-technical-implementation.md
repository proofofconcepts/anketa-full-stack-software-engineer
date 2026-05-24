# Frontend Foundation - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-frontend-foundation](../adr/ADR-001-frontend-foundation.md)

---

## 1. Overview

This spec documents the current frontend baseline, including runtime architecture, API integration boundaries, and implementation constraints used to connect the React web client to backend poll and vote endpoints.

---

## 2. Goals

- Establish a clear frontend foundation for iterative feature delivery.
- Keep API integration aligned with backend contracts.
- Provide a simple, testable base for poll browsing and vote submission.
- Capture current constraints transparently for future iterations.

## 3. Non-Goals

- Building a complete auth UI flow.
- Introducing final design system and routing architecture.
- Implementing advanced state persistence and offline capability.

---

## 4. Background & Context

The repository follows a backend-first strategy and then introduces a lightweight web client for contract validation and user flow testing. The current frontend scope prioritizes stable API consumption and simple UI feedback loops over full product completeness.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 Runtime and Composition

- REQ-01 (P0): The frontend MUST run on React + TypeScript with Vite.
- REQ-02 (P0): The app MUST compose page state and feature orchestration through `src/App.tsx`.
- REQ-03 (P1): API access SHOULD be centralized via `src/api/client.ts`.

### 5.2 API Integration Surface

- REQ-04 (P0): The frontend MUST integrate with `GET /v1/polls`.
- REQ-05 (P0): The frontend MUST integrate with `POST /v1/votes` using Bearer authentication.
- REQ-06 (P1): Frontend request and error behavior SHOULD remain predictable for local debugging.

---

## 6. Non-Functional Requirements

- Performance: Core pages should render and refresh without noticeable lag in local development.
- Availability: Frontend should remain usable when backend is available and clearly report failures otherwise.
- Security: Access tokens should be transmitted only as needed for authenticated requests.
- Observability: Errors should be visible to the user for quick troubleshooting.
- Scalability: Structure should support adding auth, routing, and richer state management without major rewrites.

---

## 7. User Stories / Scenarios

```text
As a developer or tester,
I want a working frontend baseline,
So that I can validate backend contracts through real user interactions.
```

### Acceptance Criteria

- [ ] Given the frontend is running, when backend is reachable, then polls can be loaded and rendered.
- [ ] Given an authenticated context, when a vote is submitted, then the app calls the vote endpoint correctly.
- [ ] Given API failure, when request fails, then a visible error message is shown.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
[React UI] -> [App State in App.tsx] -> [api/client.ts] -> [Backend /v1 API]
```

### 8.2 Data Model

```ts
interface PollOption {
  id: string;
  label: string;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}
```

### 8.3 API Contract

Current API integration:

- `GET /v1/polls`
- `POST /v1/votes`

### 8.4 Key Flows

Happy path:

1. App loads and requests polls.
2. User reviews options.
3. User submits vote with token.
4. App refreshes poll view.

Edge cases:

- Missing token prevents vote action and shows a message.
- API error responses are surfaced as user-visible feedback.

---

## 9. Error Handling

- Poll load failure: show error message and allow retry.
- Vote submission failure: show backend error message when available.
- Missing auth token for vote: block request and show guidance message.

---

## 10. Open Questions

1. Should token entry remain manual or move to an explicit login flow in the next iteration?
Owner: @team
Status: Open

2. Should global state management be introduced before adding more frontend features?
Owner: @team
Status: Open

---

## 11. Out of Scope / Future Work

- Dedicated register/login screens and token lifecycle UX.
- Route-level architecture for multi-page experiences.
- Advanced error boundaries and telemetry.

---

## 12. References

- [Frontend poll feed spec](01-feature-poll-feed-spec.md)
- [Frontend vote action spec](02-feature-vote-action-spec.md)
- [Backend overview spec](../../../backend/docs/specs/00-overview-technical-implementation.md)
