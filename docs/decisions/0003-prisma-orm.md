# ADR-0003: Prisma ORM

## Status
Accepted

## Context
The backend needs a database access layer for PostgreSQL. The options are a raw query builder (Knex), an active-record ORM (TypeORM), or a schema-first ORM (Prisma).

## Decision
Use Prisma ORM. Its schema file (`schema.prisma`) is the single source of truth for the data model, migrations are generated automatically, and the generated Prisma Client is fully typed — no manual type mappings needed. It integrates seamlessly with NestJS via a singleton `PrismaService`.

## Consequences
- Schema changes require running `prisma migrate dev`, which generates a SQL migration and updates the client.
- Prisma Client typings are auto-generated — running `prisma generate` must be part of the dev setup and CI pipeline.
- Complex raw queries can be expressed via `$queryRaw` when the ORM abstraction is insufficient.
- TypeORM is explicitly avoided: its decorator-based models create tight coupling between the ORM and domain classes.
