# ADR-0002: NestJS as Backend Framework

## Status
Accepted

## Context
The backend needs a structured, opinionated Node.js framework that supports TypeScript natively, scales to multiple feature modules, and integrates well with Prisma ORM and Swagger documentation.

## Decision
Use NestJS with TypeScript. Its module system maps cleanly to domain features (AuthModule, PollsModule, etc.), its decorator-based approach works well with class-validator DTOs and Swagger, and its dependency injection container makes services easy to unit test with mocked dependencies.

## Consequences
- Encourages a consistent, layered architecture (controller → service → data layer).
- More boilerplate than Express, but the structure pays off as the codebase grows.
- Strong community ecosystem: `@nestjs/jwt`, `@nestjs/swagger`, `@nestjs/config` are all first-party.
- Guards, interceptors, and pipes provide clean cross-cutting concerns without polluting controllers.
