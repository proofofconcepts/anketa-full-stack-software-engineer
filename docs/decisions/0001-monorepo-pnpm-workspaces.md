# ADR-0001: Monorepo with PNPM Workspaces

## Status
Accepted

## Context
The project has three distinct apps (NestJS API, React web, Flutter mobile) and a shared TypeScript types package. They need to live in one repository for simplified navigation, shared tooling, and a single source of truth for the domain types.

## Decision
Use a single git repository with PNPM workspaces to manage the JavaScript/TypeScript apps and packages. Flutter lives in `apps/mobile` as a plain directory (outside the PNPM workspace graph since it uses Dart). No build orchestration layer (e.g. Turborepo) is added — each app is run and tested independently via `pnpm --filter <name> <script>`.

## Consequences
- Simple setup: no extra tooling to learn or configure beyond PNPM itself.
- No shared build cache or parallel task graph — each app must be started manually in its own terminal.
- Adding a build orchestrator later (Turborepo, Nx) is straightforward if caching becomes a pain point.
