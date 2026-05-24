# Create Poll - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-frontend-foundation](../adr/ADR-001-frontend-foundation.md), [ADR-003-zustand-state-management](../adr/ADR-003-zustand-state-management.md)

---

## 1. Overview

This feature allows authenticated users to create a new poll directly from the web client by submitting a question and at least two options to `POST /v1/polls`, after which the poll feed reloads to reflect the newly created entry.

---

## 2. Goals

- Provide a UI form for composing a poll question and option labels.
- Submit the poll payload to the backend and handle success and error responses.
- Reload the poll feed after successful creation so the new poll is immediately visible.
- Keep the create form gated behind an authenticated token.

## 3. Non-Goals

- Editing or deleting an existing poll from this form.
- Rich-media or image-based poll options.
- Drafts, scheduling, or visibility controls.

---

## 4. Background & Context

The backend exposes `POST /v1/polls` behind JWT auth. The frontend already manages the JWT token via `useAuthStore`. This spec closes the gap between the existing poll feed (read path) and the missing poll creation path (write path), making the web client a complete round-trip integration surface against the polls module.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 Form Composition

- REQ-01 (P0): The UI MUST provide an input for the poll question.
- REQ-02 (P0): The UI MUST provide at least two option label inputs.
- REQ-03 (P1): The UI SHOULD allow the user to add additional option inputs dynamically (up to a reasonable maximum).
- REQ-04 (P1): The UI SHOULD disable the submit action while a creation request is in flight.

### 5.2 Submission and Contract

- REQ-05 (P0): On submit, the client MUST send `POST /v1/polls` with a JSON body matching `{ question: string; options: string[] }`.
- REQ-06 (P0): The request MUST include the `Authorization: Bearer <token>` header from the auth store.
- REQ-07 (P0): The question MUST be between 5 and 300 characters before submission is allowed.
- REQ-08 (P0): The options array MUST contain at least 2 non-empty string values before submission is allowed.

### 5.3 Post-Submission Behaviour

- REQ-09 (P0): On success, the client MUST reload the poll feed.
- REQ-10 (P0): On success, the create form MUST be reset to its empty state.
- REQ-11 (P0): On error, the client MUST display the error message returned by the API.

---

## 6. Non-Functional Requirements

- Performance: Form submission and feed reload should feel immediate under normal network conditions.
- Security: The token MUST NOT be logged or exposed in UI error messages.
- Usability: Client-side validation feedback SHOULD appear before the network request is made.
- Scalability: The form component should be self-contained and independently importable.

---

## 7. User Stories / Scenarios

```text
As an authenticated user,
I want to create a new poll with a question and options,
So that other users can vote on it.
```

### Acceptance Criteria

- [ ] Given a valid token, when the user submits a valid question and two options, then the poll is created and the feed refreshes.
- [ ] Given a missing token, when the user attempts to submit, then a client-side notice prevents the request.
- [ ] Given a question shorter than 5 characters, when the user attempts to submit, then client-side validation blocks the request.
- [ ] Given fewer than 2 non-empty options, when the user attempts to submit, then client-side validation blocks the request.
- [ ] Given the backend returns an error (e.g. 401), when submission fails, then the error message is displayed.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
[CreatePollForm component]
  -> usePollsStore.createPoll(question, options, token)
  -> POST /v1/polls  { question, options }
  -> on success: usePollsStore.loadPolls()
```

### 8.2 Data Model

Request payload (matches `CreatePollDto`):

```ts
interface CreatePollPayload {
  question: string;   // 5–300 characters
  options: string[];  // minimum 2 non-empty strings
}
```

### 8.3 API Contract

- `POST /v1/polls`
- Header: `Authorization: Bearer <accessToken>`
- Body: `{ question: string; options: string[] }`
- Success: `201 Created` — returns the created `Poll` object with `options` included
- Error: `401 Unauthorized` when token is absent or invalid

### 8.4 Key Flows

Happy path:

1. User fills in question and at least two option labels.
2. User submits the form.
3. Client validates locally; if valid, sends `POST /v1/polls` with bearer token.
4. On `201`, the form resets and `loadPolls()` is called.
5. The new poll appears at the top of the feed.

Edge cases:

- Token missing: show notice before sending the request.
- Validation failure: show inline field feedback; do not send request.
- API error: show error banner; preserve current form state so the user can retry.

---

## 9. Error Handling

- Token absent: client-side notice, no network request made.
- Validation errors: inline feedback per field, submit disabled.
- `401 Unauthorized`: display API error message, prompt user to check token.
- `400 Bad Request`: display validation message from API.
- Network failure: display generic error and allow retry.

---

## 10. Open Questions

1. Should the create form be inline on the feed page or in a separate modal/route?
   Owner: @team
   Status: Open

2. Should there be a maximum number of options enforced on the client side?
   Owner: @team
   Status: Open

---

## 11. Out of Scope / Future Work

- Poll editing and deletion from the web client.
- Scheduling polls for future publication.
- Option reordering via drag-and-drop.

---

## 12. References

- [Frontend overview spec](00-overview-technical-implementation.md)
- [Frontend poll feed spec](01-feature-poll-feed-spec.md)
- [Frontend vote action spec](02-feature-vote-action-spec.md)
- [Backend polls spec](../../../backend/docs/specs/03-feature-polls-spec.md)
