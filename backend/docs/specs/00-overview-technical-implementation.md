# 00 - Overview Technical Implementation

## Purpose
This document provides a technical implementation overview of the current backend API.

## Stack
- Framework: NestJS (TypeScript)
- API docs: Swagger + OpenAPI 3.0.3
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT access token + refresh token rotation
- Runtime: Node.js
- Local infra: Docker + Docker Compose

## Architecture Overview
- App bootstrap config is in `src/main.ts`.
- Global prefix: `/v1`.
- Domain modules:
  - Auth
  - Polls
  - Votes
- Shared infrastructure:
  - Prisma service for DB access
  - Global exception filter
  - Global request logging interceptor

## Request Lifecycle
1. Request enters controller route under `/v1`.
2. Validation pipe enforces DTO schema and strips unknown fields.
3. JWT guard protects private routes where required.
4. Service layer executes business logic and Prisma operations.
5. Response is returned, and structured request log is emitted.
6. Errors are normalized by global exception filter.

## Data Model Highlights
- `User.email` is unique.
- `Vote` has unique constraint on `[userId, pollId]` to enforce one vote per user per poll.
- `RefreshToken.tokenHash` is unique and used for refresh rotation.
- Relations use cascading deletes to keep referential integrity.

## Security Implementation
- Passwords are hashed before persistence.
- Access token secures private endpoints.
- Refresh token is rotated and previous token is revoked.
- DTO validation is enabled globally with whitelist and forbidNonWhitelisted.

## Observability Implementation
- Request logs emit JSON with request ID, route, method, status, and latency.
- Error logs emit JSON with method, route, status, and message.
- Response includes `x-request-id` header for traceability.

## Spec-Driven and ADR Workflow
- OpenAPI spec is maintained in `openapi/anketa-social-vote.openapi.yaml`.
- Feature behavior is documented in sequential spec files under this folder.
- Architecture-impacting choices are recorded in `docs/adr/`.

## Current Gaps
- `DELETE /v1/polls/:pollId` is implemented in code and feature spec, and should remain synchronized with OpenAPI contract updates.
