# CLAUDE.md

## Goal
This repository is a study project to prepare for a technical interview for a Full Stack Software Engineer role.

The product theme is a social vote platform inspired by Anketa: users create polls, vote, and view transparent results.

## Product Scope
This project should represent a full-stack system with three connected areas:

1. Backend API
- Build the core business logic and data integrity rules.
- Expose secure REST APIs for auth, polls, and voting.
- Use NestJS, Prisma, PostgreSQL, JWT auth, Swagger/OpenAPI, Docker, Docker Compose.
- Include structured terminal logs for observability.
- Use spec-driven development and ADR documents for major decisions.

2. Web
- Web client consumes the backend API contract.
- Focus on clarity, responsiveness, and reliable API integration.
- Keep the web layer aligned with backend contracts and validation rules.

3. Mobile
- Mobile client (Flutter target) consumes the same backend API contract.
- Prioritize stable integration, auth handling, network-state handling, and performance basics.

## Interview Study Intent
This repo should showcase interview-ready engineering practices taken from the job description:
- Clean, maintainable, testable code.
- Strong TypeScript and NestJS fundamentals.
- Solid Prisma schema design and relational modeling.
- API documentation quality (Swagger/OpenAPI).
- Testing discipline (unit, integration, contract, and e2e where relevant).
- Collaboration habits: clear PR scope, code review readiness, and technical documentation.
- Strong software principles: DRY, SOLID, and pragmatic clean architecture.

## Backend-First Delivery Plan
Current focus is backend first. Follow this order:
1. Stabilize backend API contract and domain rules.
2. Harden auth, vote constraints, and observability.
3. Expand automated tests.
4. Integrate web and mobile clients against stable API contracts.

## Working Rules
- Mandatory requirements for every feature/change:
1. Always use spec-driven development.
2. Always use ADRs for architecture-impacting decisions.

- Update OpenAPI spec before backend behavior changes.
- Keep module boundaries explicit (auth, polls, votes, shared infra).
- Enforce one vote per user per poll at database level.
- Keep logs structured and useful for troubleshooting.
- Record architecture-impacting decisions in ADRs.
- Keep this file updated as project scope evolves.
