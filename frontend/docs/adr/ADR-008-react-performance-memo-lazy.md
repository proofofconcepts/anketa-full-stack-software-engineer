# ADR-008: React Performance Patterns — Memo and Lazy Loading

## Status

Accepted

## Context

The frontend renders a poll feed where `PollCard` is repeated for every poll in the list. As the feed grows, unnecessary re-renders of unchanged cards become a measurable cost. Separately, the route components (`FeedPage`, `CreatePollPage`) are bundled into a single JavaScript chunk, meaning the user downloads code for every route on the first load even if they never visit some routes. The job description lists code splitting, memoization, and lazy loading as required performance optimization techniques.

## Decision

- Wrap `PollCard` with `React.memo` so it only re-renders when its own props change.
- Replace direct imports of route page components in `router.ts` with `React.lazy` calls so each route is code-split into its own chunk.
- Wrap the `<Outlet />` in `__root.tsx` with `<Suspense>` to handle the async chunk loading with a fallback UI.

## Consequences

- `PollCard` re-renders are skipped when parent state changes but the card's props are unchanged — most relevant when casting a vote updates only one card in a long list.
- Each route page is loaded on demand; the initial bundle shrinks proportionally to the code moved into lazy chunks.
- `Suspense` fallback must always be present when lazy components are used; omitting it is a runtime error.
- `React.memo` only performs a shallow prop comparison; if props include new object references on every render, memo has no effect — callers must stabilise references if needed.
- These are targeted, low-risk changes; no architectural refactor of stores or routing is required.
