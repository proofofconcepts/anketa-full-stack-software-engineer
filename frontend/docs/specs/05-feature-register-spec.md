# Feature Spec 05: Register Screen

## Status

Accepted

## Goal

Add a `/register` route so new users can create an account without leaving the app.

## Requirements

### Functional

- Users can create an account with a display name, email address, and password.
- On successful registration, `accessToken` and `refreshToken` are stored and the user is redirected to the feed (`/`).
- On failed registration (email already taken, validation error, network error), an inline error message is displayed and the user remains on `/register`.
- The login page links to `/register`; the register page links back to `/login`.
- Unauthenticated users can access `/register` without being redirected.
- Authenticated users visiting `/register` are redirected to `/`.

### Validation (enforced client-side via `minLength` and server-side)

- Display name: minimum 2 characters.
- Password: minimum 8 characters.

## Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| AC1 | The user enters valid details and submits | — | Tokens are stored; user lands on `/` |
| AC2 | The user submits with an already-registered email | — | Error message "Email already registered" (or similar from API) is shown |
| AC3 | The user is authenticated | They visit `/register` | They are redirected to `/` |
| AC4 | The user is on `/login` | They click "Create account" | They navigate to `/register` |
| AC5 | The user is on `/register` | They click "Sign in" | They navigate to `/login` |

## Technical Design

### Endpoint

`POST /v1/auth/register`

Request body:
```json
{ "email": "string", "password": "string (min 8)", "displayName": "string (min 2)" }
```

Response (`201 Created`):
```json
{ "accessToken": "string", "refreshToken": "string", "tokenType": "Bearer" }
```

Error (`409 Conflict`):
```json
{ "message": "Email already registered" }
```

### Components / Files

- `src/routes/register.tsx` — `RegisterPage` component; same local-state pattern as `LoginPage`
- `src/api/client.ts` — `register(email, password, displayName): Promise<AuthResponse>`
- `src/router.ts` — `registerRoute` with inverse auth guard; added to route tree
- `src/routes/login.tsx` — "Create account" link added
