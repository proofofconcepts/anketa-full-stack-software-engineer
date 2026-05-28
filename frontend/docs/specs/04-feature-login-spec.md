# Feature Spec 04: Login Screen

## Status

Accepted

## Goal

Replace the manual JWT token input with a proper login screen that authenticates against `POST /v1/auth/login`, persists both tokens, and protects authenticated routes.

## Requirements

### Functional

- Users can sign in with an email address and password.
- On successful login, `accessToken` and `refreshToken` are stored in localStorage and the user is redirected to the feed (`/`).
- On failed login (wrong credentials, network error), an inline error message is displayed and the user remains on `/login`.
- Unauthenticated users attempting to access `/` or `/polls/new` are redirected to `/login`.
- Authenticated users visiting `/login` are redirected to `/`.
- A Logout button is visible in the header when authenticated; clicking it clears both tokens and redirects to `/login`.

### Non-Functional

- The login form must be keyboard-accessible (tab order, enter-to-submit).
- The submit button shows a loading state while the request is in flight.
- Tokens survive a full page reload (localStorage persistence).

## Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| AC1 | The user is unauthenticated | They navigate to `/` | They are redirected to `/login` |
| AC2 | The user is unauthenticated | They navigate to `/polls/new` | They are redirected to `/login` |
| AC3 | The user enters valid credentials and submits | — | `accessToken` and `refreshToken` are stored; user lands on `/` |
| AC4 | The user enters invalid credentials and submits | — | An error message is displayed; user remains on `/login` |
| AC5 | The user is authenticated | They navigate to `/login` | They are redirected to `/` |
| AC6 | The user is authenticated | They click Logout | Tokens are cleared; user is redirected to `/login` |
| AC7 | The user reloads the page while authenticated | — | They remain authenticated (tokens persist via localStorage) |

## Technical Design

### Endpoint

`POST /v1/auth/login`

Request body:
```json
{ "email": "string", "password": "string" }
```

Response (`200 OK`):
```json
{ "accessToken": "string", "refreshToken": "string", "tokenType": "Bearer" }
```

Error (`401 Unauthorized`):
```json
{ "message": "Invalid credentials" }
```

### Components

- `src/routes/login.tsx` — `LoginPage` component; local `useState` for form fields and loading/error state
- `src/store/auth.store.ts` — `setTokens(accessToken, refreshToken)`, `logout()`, `selectIsAuthenticated`
- `src/api/client.ts` — `login(email, password): Promise<AuthResponse>`
- `src/router.ts` — `beforeLoad` guards on `/`, `/polls/new`, and `/login`
- `src/routes/__root.tsx` — conditional nav + logout button

### Out of Scope

- Registration screen (future spec)
- Automatic token refresh on 401 (future ADR)
- "Forgot password" flow
