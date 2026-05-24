# CLAUDE.md

## Project Context
Backend service for Anketa social voting platform.

## Architecture
- Framework: NestJS (TypeScript)
- Data layer: Prisma + PostgreSQL
- Auth: JWT access/refresh rotation
- API contract: OpenAPI-first + Swagger runtime docs

## Engineering Rules
- Update OpenAPI spec before endpoint implementation changes.
- Keep modules cohesive by domain (`auth`, `polls`, `votes`).
- Preserve unique vote rule (`userId`, `pollId`) and token rotation behavior.
- Add tests for behavior changes (unit/e2e/contract).

## Observability
- Keep structured JSON logs in request interceptor and exception filter.
- Include correlation IDs in all request logs.

## Local Workflow
- Use Docker Compose for DB and API.
- Run Prisma migrate/generate after schema changes.
- Use VS Code launch profile for debugging.
