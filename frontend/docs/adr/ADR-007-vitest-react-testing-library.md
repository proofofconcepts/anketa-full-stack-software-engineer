# ADR-007: Vitest + React Testing Library for Frontend Unit Tests

## Status

Accepted

## Context

The frontend has no automated tests. The job description requires comprehensive testing strategies and a commitment to testable code. Vite is already the build tool, and the project uses TypeScript with React 18. Jest is the natural choice on the backend, but running Jest in a Vite project requires additional transformation setup and diverges from the Vite ecosystem. Vitest is Vite-native, shares the same config file, and is API-compatible with Jest, so the learning investment transfers directly.

## Decision

- Use **Vitest** as the test runner, configured inside `vite.config.ts` under the `test` key.
- Set `globals: true` so `describe`, `it`, `expect`, and `vi` are available without explicit imports.
- Set `environment: 'jsdom'` so DOM APIs are available in all tests.
- Add `"vitest/globals"` to `tsconfig.json` `types` so the TypeScript language service resolves Vitest globals without errors.
- Use **React Testing Library** (`@testing-library/react`) for component rendering and queries.
- Use **`@testing-library/jest-dom`** for DOM-specific matchers; import it once in `frontend/test/setup.ts`, referenced via `setupFiles`.
- Use **`@testing-library/user-event`** for simulating user interactions.
- Place all test files under `frontend/test/` mirroring the `src/` structure:
  - `frontend/test/components/` for component tests (`*.test.tsx`)
  - `frontend/test/store/` for Zustand store tests (`*.test.ts`)

## Consequences

- Vitest reuses the existing Vite config and plugins; no separate build pipeline for tests.
- Jest API compatibility means test patterns (mocks, spies, matchers) are identical to backend tests.
- `globals: true` keeps test files concise; `tsconfig.json` types entry keeps the language service clean.
- Store tests use `usePollsStore.setState()` to reset state in `beforeEach`, keeping tests isolated without wrapping in a React component.
- Component tests mock `@mantine/hooks` to avoid `useLogger` side effects in jsdom.
- New test files follow the pattern: mirror the `src/` path under `test/`, use `*.test.tsx` for components and `*.test.ts` for plain logic.
