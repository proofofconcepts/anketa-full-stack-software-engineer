# ADR-0004: JWT Authentication with Refresh Token Rotation

## Status
Accepted

## Context
The API needs stateless authentication that works across the web frontend and the Flutter mobile app. Session-based auth would require sticky sessions or a shared session store; API key auth lacks user-level granularity.

## Decision
Use JWT with two tokens:
- **Access token** — short-lived (15 minutes), sent in the `Authorization: Bearer` header on every protected request.
- **Refresh token** — long-lived (7 days), stored securely by the client, used to obtain a new access token via `POST /auth/refresh`. On each refresh the old refresh token is invalidated and a new one is issued (rotation), limiting the damage of a leaked refresh token.

Passwords are hashed with bcrypt (cost factor 12).

## Consequences
- Stateless access tokens cannot be revoked before expiry — a 15-minute window is the trade-off.
- Refresh token rotation requires storing issued refresh tokens in the database to detect reuse attacks.
- Both web and mobile clients follow the same auth flow, simplifying the API surface.
