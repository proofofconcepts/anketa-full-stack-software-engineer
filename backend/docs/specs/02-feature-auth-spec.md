# Authentication Flows - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-nestjs-modular-architecture](../adr/ADR-001-nestjs-modular-architecture.md), [ADR-004-jwt-refresh-rotation](../adr/ADR-004-jwt-refresh-rotation.md)

---

## 1. Overview

This feature defines authentication capabilities for user registration, login, and refresh-token rotation so clients can securely obtain and renew access credentials for protected API routes.

---

## 2. Goals

- Provide secure user registration and login flows.
- Issue access and refresh tokens for authenticated sessions.
- Enforce refresh-token rotation and revocation behavior.
- Keep auth error handling predictable for clients.

## 3. Non-Goals

- Password reset and account recovery workflows.
- External identity provider integration.
- Session management UI concerns on clients.

---

## 4. Background & Context

The backend requires a robust auth baseline before expanding frontend and mobile capabilities. JWT-based access with refresh rotation was selected to balance security and usability while keeping client integration straightforward.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 Registration

- REQ-01 (P0): The system MUST expose `POST /v1/auth/register`.
- REQ-02 (P0): Registration payloads MUST be validated for email, password, and display name.
- REQ-03 (P0): Duplicate email registration attempts MUST be rejected.
- REQ-04 (P0): Successful registration MUST return access and refresh tokens.

### 5.2 Login

- REQ-05 (P0): The system MUST expose `POST /v1/auth/login`.
- REQ-06 (P0): Login MUST validate credentials and reject invalid combinations.
- REQ-07 (P0): Successful login MUST return access and refresh tokens.

### 5.3 Refresh Rotation

- REQ-08 (P0): The system MUST expose `POST /v1/auth/refresh`.
- REQ-09 (P0): Refresh requests MUST validate token existence, expiry, and revocation state.
- REQ-10 (P0): Valid refresh requests MUST revoke the previous refresh token and issue a new token pair.

---

## 6. Non-Functional Requirements

- Performance: Auth endpoints should respond quickly under expected local load.
- Availability: Auth routes should be available whenever the API is healthy.
- Security: Passwords must be hashed and tokens must be validated consistently.
- Observability: Auth requests and failures must emit structured logs.
- Scalability: Auth design should support growth without breaking token semantics.

---

## 7. User Stories / Scenarios

```text
As an end user,
I want to register and log in securely,
So that I can access protected polling and voting features.
```

### Acceptance Criteria

- [ ] Given no account exists, when a valid register request is sent, then status 201 and token pair are returned.
- [ ] Given invalid credentials, when login is attempted, then status 401 is returned.
- [ ] Given a valid refresh token, when refresh is called, then a new token pair is returned and old refresh token is revoked.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
[Client] -> [/v1/auth/* Controller] -> [Auth Service]
                                   -> [Prisma User + RefreshToken]
                                   -> [JWT signing and verification]
```

### 8.2 Data Model

```ts
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

Persistent considerations:

- User email uniqueness is enforced.
- Refresh token hashes are stored and tracked with revocation and expiry semantics.

### 8.3 API Contract

Endpoints:

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`

Token response shape includes:

- `accessToken`
- `refreshToken`

### 8.4 Key Flows

Happy path:

1. Client registers or logs in with valid payload.
2. Service validates input and credentials.
3. Service issues JWT access and refresh tokens.
4. Refresh flow revokes old refresh token and issues a new pair.

Edge cases:

- Duplicate email registration returns conflict.
- Invalid credentials return unauthorized.
- Expired or revoked refresh token returns unauthorized.

---

## 9. Error Handling

- Duplicate registration: return conflict error.
- Invalid credentials: return unauthorized error.
- Invalid, expired, or revoked refresh token: return unauthorized error.
- Validation failures: return normalized bad-request payload.

---

## 10. Open Questions

1. Should refresh token lifetimes differ by client type (web vs mobile)?
Owner: @team
Status: Open

2. Should additional device-level metadata be tracked on refresh tokens?
Owner: @team
Status: Open

---

## 11. Out of Scope / Future Work

- Password reset, account recovery, and email verification.
- Multi-factor authentication.
- Third-party social login providers.

---

## 12. References

- [Backend overview spec](00-overview-technical-implementation.md)
- [Health feature spec](01-feature-health-spec.md)
- [Backend OpenAPI contract](../../openapi/anketa-social-vote.openapi.yaml)
