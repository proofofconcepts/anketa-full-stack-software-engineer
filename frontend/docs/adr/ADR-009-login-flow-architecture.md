# ADR-009: Login Flow Architecture

## Status

Accepted

## Context

The app previously required users to manually paste a JWT access token into a text input in the root layout — a developer convenience that is not a viable UX for production or demo. The backend already exposes `POST /v1/auth/login` (and `/register`, `/refresh`) returning `{ accessToken, refreshToken, tokenType }`.

A proper login screen is needed that:
- Collects email and password and exchanges them for tokens via the backend
- Persists both tokens across page reloads
- Protects authenticated routes and redirects to `/login` when unauthenticated
- Removes the manual token input from the global layout

## Decisions

### D1 — Route guard mechanism: `beforeLoad` in TanStack Router

TanStack Router's `beforeLoad` hook runs synchronously before a route renders. It receives the route context and can throw `redirect(...)` to abort navigation. This is the canonical pattern for auth guards in TanStack Router — no HOC, wrapper component, or layout nesting trick is needed.

The check reads `useAuthStore.getState().accessToken` directly (Zustand stores are plain module-level singletons, accessible outside React trees).

**Rejected alternatives:**
- *Wrapper component guard*: Requires the route component to mount before the redirect fires — causes a flash of the protected page.
- *Context-based auth provider*: Unnecessary indirection; Zustand already provides global state without React context.

### D2 — Auth store shape

Rename `token` → `accessToken` for clarity. Add `refreshToken: string`. Replace `setToken(token)` with `setTokens(accessToken, refreshToken)` to update both atomically. Replace `clearToken()` with `logout()` for semantic clarity. Export a `selectIsAuthenticated` selector (`accessToken.length > 0`) for use in components.

The persist key `'anketa-auth'` is unchanged. Existing localStorage with the old `{ token }` shape deserializes with `accessToken: undefined`, which defaults to `''`, effectively logging the user out on first load after the upgrade. This is intentional and safe for the current development phase.

### D3 — Login API function location

`login(email, password)` is added to `src/api/client.ts` alongside the existing `getPolls`, `submitVote`, and `createPoll` functions. All API calls live in one module; no separate auth client is needed at this scale.

### D4 — Login form state: local `useState`, not a Zustand store

The login form has two ephemeral fields (email, password) used only within the login page and discarded after submission. A Zustand store is appropriate for domain state shared across routes or persisted across renders — not for a two-field form. This is consistent with ADR-003.

### D5 — No auto-refresh in this iteration

Token refresh logic (intercepting 401 responses and retrying with a new access token via `POST /v1/auth/refresh`) is intentionally deferred. A 401 error surfaces as a plain error message to the user, who can log in again. This keeps the implementation minimal and testable. A future ADR will cover the refresh interceptor pattern.

### D6 — `/login` is a child of the root layout

The `/login` route is placed under `rootRoute` (same as `/` and `/polls/new`) to inherit `MantineProvider` without duplicating it. The root layout conditionally hides the navigation links when the user is not authenticated, so the login page renders cleanly without nav elements.

## Consequences

- `useAuthStore` callers that read `token` must be updated to `accessToken`.
- The `submitCreatePoll(token)` and `castVote(pollId, optionId, token)` functions already accept a string parameter — they continue to work unchanged after the rename in their callers.
- Unauthenticated users navigating to `/` or `/polls/new` are now redirected to `/login` instead of landing on the page without a token.
- A logged-in user navigating to `/login` is redirected to `/` (inverse guard).
