# Anketa Social Vote Backend

NestJS backend foundation for a social voting platform.

## Stack
- NestJS + TypeScript
- Swagger/OpenAPI
- JWT auth (access + refresh rotation)
- Prisma + PostgreSQL
- Docker + Docker Compose
- Structured request/error logging to terminal

## Quick Start
1. Copy env file:
   - `cp .env.example .env` (or create `.env` manually on Windows)
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Start app:
   - `npm run start:dev`

## Docker
1. Ensure `.env` exists.
2. Run stack:
   - `docker compose up --build`

## Swagger and Spec
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI source: `openapi/anketa-social-vote.openapi.yaml`

## Debugging (VS Code)
Use launch profile: `Nest: Debug API` from `.vscode/launch.json`.

## Current Endpoints (v1)
- `GET /v1/health`
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `GET /v1/polls`
- `POST /v1/polls` (JWT)
- `DELETE /v1/polls/:pollId` (JWT owner)
- `POST /v1/votes` (JWT, one vote per user per poll)

## Architecture Decisions
See `docs/adr/` for ADR records.
