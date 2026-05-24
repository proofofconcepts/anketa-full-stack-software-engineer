# ADR-004: JWT Access + Refresh Rotation

## Status
Accepted

## Decision
Use short-lived access JWT and refresh-token rotation. Persist refresh tokens in DB and revoke previous token on each refresh.

## Consequences
- Reduces blast radius of leaked access tokens.
- Allows targeted refresh revocation.
