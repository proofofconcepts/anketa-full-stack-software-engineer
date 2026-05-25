# ADR-006: Jest Unit Testing Strategy for Service Layer

## Status

Accepted

## Context

The backend services (`AuthService`, `PollsService`, `VotesService`) contain the core business logic of the application. Without automated tests, regressions are caught only at runtime or through manual inspection. The job description explicitly requires unit and integration tests with Jest, and the repository's working rules require high code quality standards. The main `tsconfig.json` excludes `test/` and `**/*spec.ts` to keep the production build clean, which means test files need their own TypeScript configuration.

## Decision

- Use **Jest** with **ts-jest** as the test runner for all backend unit tests.
- Place unit tests under `backend/test/unit/` using the `*.spec.ts` naming convention.
- Create `tsconfig.spec.json` that extends the base `tsconfig.json` and explicitly includes `test/**/*.ts` with `"types": ["jest", "node"]`, so the TypeScript language service resolves Jest globals in test files without polluting the production config.
- Wire ts-jest to use `tsconfig.spec.json` via the `transform` option in the Jest config inside `package.json`.
- Test each service in isolation using `@nestjs/testing` `TestingModule` with mock provider values — no real database or external service is called.
- Mock `bcryptjs` at the module level with `jest.mock` to avoid hashing overhead.
- Reset all mocks in `afterEach` with `jest.clearAllMocks()`.

## Consequences

- Services are tested in complete isolation; tests run in milliseconds with no I/O.
- `tsconfig.spec.json` is the canonical TypeScript config for all test files; any new spec file is covered automatically by its `include` glob.
- The production build (`tsconfig.json`) remains clean — test files are not compiled into `dist/`.
- Adding tests for new services follows a consistent pattern: one `*.spec.ts` file in `test/unit/`, one `TestingModule`, mock providers.
- Integration and E2E tests (in `test/e2e/`) use their own Jest configs and are out of scope for this ADR.
