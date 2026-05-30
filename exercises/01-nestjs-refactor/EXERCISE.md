# Exercise 01 — NestJS Users Search Refactor

## Starting point

See `poor-code.ts`.

## What is wrong — identify each problem

1. **Data hardcoded in the controller** — a controller is an HTTP adapter; it must never own data. Data belongs in a database accessed through a repository.
2. **No service layer** — filtering logic is in the controller. Business logic must live in a `@Injectable()` service.
3. **No Prisma** — the role requires Prisma ORM for all database access. There is no schema, no model, and no `PrismaService` usage.
4. **No DTOs** — the response shape is a raw object literal. Responses must be typed with a class decorated with `@ApiProperty()` for Swagger.
5. **No input validation** — `query` is an unvalidated raw string. Missing `class-validator` and `class-transformer` pipe on the query param.
6. **No Swagger documentation** — missing `@ApiTags`, `@ApiOperation`, `@ApiQuery`, and `@ApiOkResponse` decorators.
7. **No error handling** — if `query` is `undefined` the `.toLowerCase()` call throws. No `@IsOptional()` guard, no fallback.
8. **No pagination** — returning an unbounded list is never acceptable in production.
9. **Mutable singleton state** — `private users` is mutated across requests in the same controller instance (singleton scope in NestJS). Even as an in-memory stub this is a race condition.

## What the refactored solution must include

- [ ] A `User` Prisma model (`id`, `name`, `role`, `createdAt`)
- [ ] A `UsersRepository` (or direct `PrismaService` injection in the service)
- [ ] A `UsersService` with a `search(query: string, page: number, limit: number)` method
- [ ] A `SearchUsersQueryDto` validated with `class-validator` (`@IsOptional()`, `@IsString()`, `@IsInt()`)
- [ ] A `UserResponseDto` and `PaginatedUsersResponseDto` typed with `@ApiProperty()`
- [ ] `UsersController` reduced to routing + delegation only
- [ ] Full Swagger decorators on the endpoint
- [ ] A Jest unit test for `UsersService.search` (mock `PrismaService`)
- [ ] A Jest integration/e2e test for `GET /users/search?q=andres`

## Checklist to self-assess your solution

- [ ] Controller has zero business logic
- [ ] No hardcoded data anywhere
- [ ] `PrismaService` is injected, not instantiated with `new`
- [ ] DTOs use `class-validator` decorators
- [ ] Swagger shows all query params and response schema
- [ ] Pagination works and defaults are documented
- [ ] Unit tests pass with mocked Prisma
- [ ] Edge case: empty query returns all users (paginated)
- [ ] Edge case: query with no matches returns `{ count: 0, data: [] }`
