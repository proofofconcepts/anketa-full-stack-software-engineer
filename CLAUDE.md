# Anketa — Claude Code Instructions

## Project Overview
Full-stack social voting platform (training project for anketa.com interview).
Monorepo managed with PNPM workspaces — no Turborepo.

## Monorepo Structure
```
anketa-full-stack-software-engineer/
├── apps/
│   ├── api/        # NestJS 11 + Prisma 6 + PostgreSQL
│   ├── web/        # React + Vite + TanStack Router + Mantine UI
│   └── mobile/     # Flutter + Bloc + GoRouter + Firebase
├── packages/
│   └── shared/     # Shared TypeScript types
├── docs/
│   ├── openapi.yaml        # API spec (source of truth)
│   └── decisions/          # ADR files
├── package.json            # Root workspace scripts
└── pnpm-workspace.yaml
```

## Dev Commands (run from repo root)
```bash
pnpm dev:api          # NestJS on http://localhost:3000 (hot-reload)
pnpm dev:web          # Vite on http://localhost:5173
pnpm test             # api + web tests
pnpm test:api         # Jest (16 tests)
pnpm test:web         # Vitest (9 tests)
pnpm lint             # ESLint across api + web
```

Swagger UI: http://localhost:3000/api/docs

## Critical Rules

### Never Commit Without Approval
Do not run `git add`, `git commit`, or `git push` without the user explicitly asking. The user always reviews diffs before committing.

### Spec-Driven Development
- Backend endpoints must exist in `docs/openapi.yaml` before implementation.
- TypeScript types come from `packages/shared` — no inline `any` guessing.
- Tests are written against the spec, not the implementation.

### Architecture Decision Records
Every significant architectural choice gets an ADR in `docs/decisions/`. Write the ADR before implementation.

## Backend (apps/api)

**Stack:** NestJS 11, Prisma 6, PostgreSQL 16, Passport JWT, Swagger, Jest

**Auth guards:**
- `JwtAuthGuard` — requires a valid JWT; 401 if missing or invalid.
- `OptionalJwtAuthGuard` — wraps `super.canActivate` in try-catch; always returns `true`; sets `request.user = undefined` for anonymous callers.
- Anonymous sentinel: `user?.id ?? ''` — empty string never matches a UUID, so Prisma returns empty arrays for anonymous vote/follow lookups.

**Prisma:**
- Schema: `apps/api/prisma/schema.prisma`
- Migrations: `cd apps/api && pnpm prisma migrate dev`
- Studio: `cd apps/api && pnpm prisma studio`

**Infrastructure:**
- `apps/api/docker-compose.yml` — Postgres only (for local dev; code runs on host)
- Start DB: `docker compose -f apps/api/docker-compose.yml up -d`

**Environment:** `apps/api/.env` (gitignored) — `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`

## Frontend (apps/web)

**Stack:** React 19, Vite 6, TanStack Router, Zustand, Mantine UI 8, Tailwind CSS

**Proxy:** `vite.config.ts` proxies `/api/*` → `http://localhost:3000`. This only works with `pnpm dev:web` (port 5173), NOT `vite preview` (port 4173).

**Mantine + TanStack Router:** Use `<NavLink component={Link as any} to="..." label="..." />` — never nest `<Link>` inside `<NavLink>` (both render `<a>`, causing a hydration error).

**Tests (Vitest + RTL):** `apps/web/src/test/setup.ts` mocks `window.matchMedia` for Mantine compatibility in jsdom.

## Mobile (apps/mobile)

**Stack:** Flutter 3, Dart, flutter_bloc ^9, GoRouter ^15, Dio ^5, GetIt ^8, Firebase

**Architecture:** Clean Architecture per feature — `domain/` → `data/` → `presentation/`

**Firebase:** Configured via `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) — not committed.

**Run:** `cd apps/mobile && flutter run`
**Test:** `cd apps/mobile && flutter test`

## Code Style

- No comments unless the WHY is non-obvious (hidden constraint, subtle invariant, workaround).
- No trailing summaries or "I just did X" explanations — user reads the diff.
- No emojis.
- No premature abstractions — three similar lines beats a helper that isn't needed yet.
- TypeScript: strict mode, no `any` except where Mantine's polymorphic `component` prop forces it.
