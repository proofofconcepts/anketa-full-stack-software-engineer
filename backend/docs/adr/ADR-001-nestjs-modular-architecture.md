# ADR-001: NestJS Modular Architecture

## Status
Accepted

## Decision
Adopt NestJS with domain modules (`auth`, `polls`, `votes`, `prisma`) and shared cross-cutting concerns (`common`).

## Consequences
- Improves maintainability and testability.
- Enables clearer ownership boundaries.
