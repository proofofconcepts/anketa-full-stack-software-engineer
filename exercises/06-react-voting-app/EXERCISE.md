# Exercise 06 — React Voting App Refactor

## Starting point

See `poor-code.tsx`.

## What is wrong — identify each problem

1. **Component defined inside a component** — `PollDetail` is declared inside `VotingApp`. React recreates it as a new component type on every render, destroying and remounting its DOM and resetting `voted` state on every parent render. Components must be defined at the module level.
2. **Mutable module-level variables** — `let globalPolls` and `let globalUser` are module-scoped mutable variables used alongside React state. This is a contradiction: React state drives re-renders, but these globals drift out of sync and could be read stale by anything outside the component tree. Global client state belongs in a Zustand store.
3. **No TypeScript types** — `polls`, `user`, `poll`, `opt` are all untyped `any`.
4. **`userId` sent from the client** — `{ optionId, userId: user.id }` allows any client to vote as any user. The server must identify the user from the JWT, not from the request body.
5. **Full refetch after every vote** — `handleVote` re-fetches the entire poll list to update a single option's vote count. This is wasteful; apply an optimistic update locally, then confirm with a targeted `PATCH` response.
6. **No error handling** — both `fetch` chains have no `.catch`. Network failures are invisible.
7. **No loading or empty states** — no feedback while the initial data loads, and no message when the poll list is empty.
8. **Implicit navigation via state** — `selectedPoll` controls which view is shown. This means the back button does nothing and deep-linking is impossible. Navigation should use TanStack Router (or React Router) with real URL routes.
9. **No memoisation** — poll list items are re-rendered on every state change. Each row should be a memoised component.
10. **No code splitting** — the poll detail view is always bundled with the feed. It should be lazy-loaded with `React.lazy` + `Suspense`.

## What the refactored solution must include

### State management — Zustand
- [ ] A `usePollStore` Zustand store with:
  - `polls: Poll[]`
  - `currentUser: User | null`
  - `fetchPolls()` action
  - `fetchCurrentUser()` action
  - `voteOnPoll(pollId: string, optionId: string)` action with optimistic update
- [ ] No module-level mutable variables
- [ ] No prop-drilling of `user` — components read from the store directly

### Types
- [ ] `Poll`, `PollOption`, `User` TypeScript interfaces

### Routing — TanStack Router (or React Router)
- [ ] `/` → `PollFeed` (lazy loaded)
- [ ] `/polls/:pollId` → `PollDetail` (lazy loaded)
- [ ] Browser back button navigates correctly

### Components
- [ ] `VotingApp` — only sets up providers and router outlet
- [ ] `PollFeed` — reads from store, renders list, handles loading/empty/error
- [ ] `PollRow` — `React.memo`, stable `onClick` via `useCallback`
- [ ] `PollDetail` — defined at module level, reads poll from store by route param

### Security
- [ ] `voteOnPoll` action sends only `{ optionId }` — no `userId` in the body

### Performance
- [ ] `PollRow` wrapped in `React.memo`
- [ ] `PollDetail` loaded with `React.lazy` + `Suspense`
- [ ] Vote action applies optimistic update before the response arrives

### Tests
- [ ] Unit test: `usePollStore.voteOnPoll` updates the option count optimistically
- [ ] Unit test: `usePollStore.voteOnPoll` rolls back the optimistic update on error
- [ ] Unit test: `PollRow` does not re-render when unrelated store state changes
- [ ] Integration test: navigating to `/polls/:pollId` renders `PollDetail`

## Checklist to self-assess your solution

- [ ] `PollDetail` is defined outside `VotingApp` (module level)
- [ ] No `let global*` variables anywhere
- [ ] Zero `any` types
- [ ] `userId` is never sent in request bodies
- [ ] Voting does not trigger a full poll-list refetch
- [ ] All fetch errors surface as user-visible messages
- [ ] URL changes when navigating to a poll detail
- [ ] Browser back button returns to the feed
- [ ] `PollRow` is memoised and does not re-render unnecessarily
- [ ] `PollDetail` is code-split with `React.lazy`
