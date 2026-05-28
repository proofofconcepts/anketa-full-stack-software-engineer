# Anketa — Social Vote Platform

A full-stack social voting platform built as a technical interview study project. Users register, create polls, and cast votes in a transparent feed. The project demonstrates production-grade patterns across a NestJS REST API and a React SPA, with spec-driven development and Architecture Decision Records throughout.

**Live demo**
- Frontend: https://anketa-frontend.onrender.com/
- API docs: https://anketa-full-stack-software-engineer.onrender.com/docs

---

## What's implemented

### Backend (NestJS)

| Feature | Details |
|---|---|
| Auth — register | `POST /v1/auth/register` — hashes password with bcrypt, issues access + refresh tokens |
| Auth — login | `POST /v1/auth/login` — validates credentials, rotates tokens |
| Auth — token refresh | `POST /v1/auth/refresh` — validates refresh token hash, issues new token pair |
| JWT guard | Passport `JwtAuthGuard` protecting all write endpoints |
| Poll feed | `GET /v1/polls` — returns polls with options and vote counts, public |
| Create poll | `POST /v1/polls` — authenticated; 1–10 options, question 5–200 chars |
| Delete poll | `DELETE /v1/polls/:pollId` — authenticated, owner-only |
| Vote | `POST /v1/votes` — authenticated; one vote per user per poll enforced at DB level |
| Swagger UI | Full OpenAPI spec at `/docs`, Bearer auth wired |
| Request logging | Interceptor logs method + URL + duration on every request |
| Health check | `GET /health` — used by Render for liveness probing |

### Frontend (React)

| Feature | Details |
|---|---|
| Register | Form with display name, email, password; navigates to feed on success |
| Login | Email + password form; redirects to feed; token persisted to localStorage |
| Route guards | `beforeLoad` redirect: unauthenticated users → `/login`; authenticated users → `/` |
| Logout | Clears stored tokens, redirects to login |
| Poll feed | Paginated-ready list of all polls with question, options, and vote counts |
| Vote | One-click vote via teal rounded buttons; disabled while request is in-flight |
| Create poll | Inline form with dynamic option list (2–5 options), validation error display |
| Responsive layout | Mobile-first with Tailwind v4 `sm:` breakpoints; 44 px touch targets; `min-h-svh` on auth pages |

---

## Tech stack

### Backend

| Layer | Choice |
|---|---|
| Runtime | Node.js 20 |
| Framework | NestJS 11 |
| Language | TypeScript 5.7 |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Auth | `@nestjs/jwt` + `passport-jwt` + bcryptjs |
| Validation | `class-validator` + `class-transformer` |
| API docs | `@nestjs/swagger` + Swagger UI |
| Testing | Jest 29 + Supertest |
| Containerisation | Docker multi-stage build + `docker-compose` for local DB |

### Frontend

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5.7 |
| Build | Vite 5 |
| Routing | TanStack Router 1.170 |
| State management | Zustand 5 with `persist` middleware |
| UI components | Mantine 7 |
| CSS | Tailwind CSS 4 |
| Testing | Vitest 4 + React Testing Library 16 + jsdom |

---

## Database schema

```
User          — id, email, displayName, passwordHash
Poll          — id, question, createdById → User
PollOption    — id, pollId → Poll, label
Vote          — id, userId → User, pollId → Poll, optionId → PollOption  (unique: userId+pollId)
RefreshToken  — id, userId → User, tokenHash, expiresAt, revokedAt
```

All foreign keys cascade on delete. `Vote` has a composite unique constraint preventing duplicate votes.

---

## Architecture decisions

### Frontend ADRs (`frontend/docs/adr/`)

| ADR | Decision |
|---|---|
| ADR-001 | React 18 + Vite + TypeScript as the frontend foundation |
| ADR-002 | Tailwind CSS v4 for utility-first styling |
| ADR-003 | Zustand v5 for client state management |
| ADR-004 | TanStack Router for type-safe client-side navigation |
| ADR-005 | Mantine UI as the component library |
| ADR-006 | `useLogger` hook for component render debugging |
| ADR-007 | Vitest + React Testing Library over Jest for frontend tests |
| ADR-008 | `React.memo` + `React.lazy` as the performance optimisation strategy |
| ADR-009 | `beforeLoad` route guards + Zustand `persist` for the login flow |

---

## Project structure

```
anketa-full-stack-software-engineer/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # register, login, refresh, JWT strategy
│   │   │   ├── polls/         # CRUD for polls
│   │   │   └── votes/         # cast vote
│   │   ├── common/
│   │   │   ├── filters/       # global HTTP exception filter
│   │   │   └── interceptors/  # request logging
│   │   ├── prisma/            # PrismaService + PrismaModule
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── Dockerfile
│   └── docker-compose.yml     # local PostgreSQL
│
└── frontend/
    ├── src/
    │   ├── routes/            # __root, feed, polls.new, login, register
    │   ├── components/        # PollCard, CreatePollForm
    │   ├── store/             # auth.store, create-poll.store
    │   ├── api/               # fetch-based client
    │   └── router.ts
    ├── test/
    │   ├── components/        # LoginPage, RegisterPage, PollCard tests
    │   ├── store/             # auth.store tests
    │   └── api/               # client tests
    └── docs/
        ├── adr/               # ADR-001 … ADR-009
        └── specs/             # feature specs 00–05
```

---

## Local setup

### Prerequisites

- Node.js 20+
- Docker and Docker Compose

### Backend

```bash
cd backend

# Start local PostgreSQL
docker-compose up -d

# Install dependencies
npm install

# Run migrations and generate Prisma client
npx prisma migrate dev
npx prisma generate

# Start dev server (http://localhost:3000)
npm run start:dev
```

Swagger UI is available at http://localhost:3000/docs.

Environment variables (create `backend/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/anketa
JWT_SECRET=change-me
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=change-me-too
REFRESH_TOKEN_EXPIRY=7d
```

### Frontend

```bash
cd frontend

npm install

# Start dev server (http://localhost:5173)
npm run dev
```

The frontend expects the backend at `http://localhost:3000`. To point it elsewhere, set `VITE_API_BASE_URL` in `frontend/.env`.

### Running tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## Development standards

- **Spec-driven development** — every feature has a written spec in `docs/specs/` before implementation.
- **ADRs** — every architecture-impacting decision is captured in `docs/adr/`.
- Code quality targets the benchmark set by the job description: clean interfaces, explicit typing, no `any` in business logic, named exports, and self-describing identifiers.
