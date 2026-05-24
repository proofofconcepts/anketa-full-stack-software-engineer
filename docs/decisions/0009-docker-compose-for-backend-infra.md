# ADR-0009: Docker and Docker Compose for Backend Infrastructure

## Status
Accepted

## Context
The NestJS backend depends on PostgreSQL. Every developer needs a consistent, zero-friction way to run the database locally without installing PostgreSQL natively. Production deployments also need a reproducible container image.

## Decision
Provide two Docker Compose configurations in `apps/api/`:

- **`docker-compose.yml`** (development) — runs PostgreSQL only. The NestJS app runs on the host via `pnpm dev:api` for fast HMR and easy debugging.
- **`docker-compose.prod.yml`** (production) — runs PostgreSQL + the built NestJS image together. The API image is built from a multi-stage `Dockerfile` (builder stage with full deps → slim runner stage with only `dist/` and `node_modules`).

Environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.) are read from a `.env` file. A `.env.example` is committed to the repository; `.env` is gitignored.

## Consequences
- Developers only need Docker and Node installed — no native PostgreSQL setup required.
- The production image is minimal (Alpine-based, only production artifacts).
- Running `prisma migrate deploy` in the container entrypoint ensures migrations are applied before the app starts.
- A separate test database container can be spun up for integration tests by overriding `POSTGRES_DB` in a `docker-compose.test.yml`.
