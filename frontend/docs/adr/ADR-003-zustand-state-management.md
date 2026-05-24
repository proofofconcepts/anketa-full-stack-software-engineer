# ADR-003: Adopt Zustand for Client State Management

## Status

Accepted

## Context

The current frontend manages all application state (polls, loading flags, error messages, auth token) through co-located `useState` calls inside `App.tsx`. As the feature surface expands — auth forms, user session persistence, optimistic vote updates — prop-drilling and scattered local state become a maintenance burden. A dedicated state management layer is needed before the component tree grows further.

The job description lists Zustand as a nice-to-have skill. Zustand is a minimal, hook-based store library that fits the existing React + Vite + TypeScript stack without requiring context providers or boilerplate reducers.

## Decision

Adopt Zustand as the client-side state management layer. Each domain slice (auth session, polls, vote state) will be defined as a separate Zustand store in `src/store/`. Components access state directly through the generated hooks, removing prop-drilling from `App.tsx`. The raw `useState` calls in `App.tsx` will be migrated to store subscriptions incrementally, starting with the polls and auth slices.

## Consequences

- Component state is colocated with its domain rather than lifted into `App.tsx`, improving readability and testability.
- Zustand stores are plain TypeScript modules — no provider wrapping is required.
- Each store is independently replaceable and unit-testable in isolation.
- Zustand's `persist` middleware can be layered onto the auth store for token persistence without additional dependencies.
- Zustand proficiency is exercised as a listed nice-to-have skill for the target role.
