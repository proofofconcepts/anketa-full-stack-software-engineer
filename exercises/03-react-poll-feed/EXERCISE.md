# Exercise 03 — React Poll Feed Refactor

## Starting point

See `poor-code.tsx`.

## What is wrong — identify each problem

1. **No TypeScript types** — `polls`, `poll`, and `option` are all typed as `any`. No interfaces for `Poll`, `PollOption`, or API responses.
2. **No error handling** — if `fetch` fails the Promise rejects silently; `setLoading(false)` never runs and the UI is stuck.
3. **No fetch cleanup** — if the component unmounts while the fetch is in flight, `setPolls` is called on an unmounted component. Missing `AbortController`.
4. **Full refetch after every vote** — `vote()` re-fetches the entire poll list on every click instead of updating only the affected poll in local state (optimistic update).
5. **Inline styles** — `style={{ ... }}` objects are recreated on every render and couple presentation to logic. Should use Tailwind classes or CSS modules.
6. **Inline event handler** — `onClick={() => vote(poll.id, option.id)}` creates a new function reference on every render, invalidating memoisation of child components.
7. **No empty state** — no UI when `polls` is an empty array.
8. **No error state** — no UI when the fetch fails.
9. **No component split** — one component handles fetching, rendering the list, rendering each card, and handling votes. Each responsibility should be a separate component.
10. **No memoisation** — the poll card is re-rendered on every parent state change. Should be extracted and wrapped with `React.memo`.

## What the refactored solution must include

### Types
- [ ] `Poll`, `PollOption` TypeScript interfaces

### Data fetching
- [ ] `useEffect` with an `AbortController`; cleanup cancels the request on unmount
- [ ] Separate `error` state rendered as a user-visible message
- [ ] Optimistic update on vote: update the matching option's vote count locally, then sync with the server

### Components
- [ ] `PollFeed` — fetching only, passes data down
- [ ] `PollCard` — renders a single poll, wrapped in `React.memo`
- [ ] `PollOption` — renders a single option button, receives a stable `onVote` callback via `useCallback`

### Styling
- [ ] No inline `style` props — use Tailwind CSS classes or a CSS module

### States rendered
- [ ] Loading skeleton or spinner
- [ ] Error message with a retry button
- [ ] Empty state when there are no polls
- [ ] Populated list

### Tests
- [ ] Unit test: `PollCard` renders question and options
- [ ] Unit test: clicking an option calls `onVote` with the correct ids
- [ ] Unit test: `PollFeed` shows error state when fetch rejects

## Checklist to self-assess your solution

- [ ] Zero `any` types
- [ ] `AbortController` cleans up on unmount
- [ ] Voting does not trigger a full refetch
- [ ] No inline `style` props
- [ ] `PollCard` and `PollOption` are memoised
- [ ] All four UI states (loading, error, empty, data) are handled
- [ ] `onVote` is stable across renders (`useCallback`)
- [ ] Tests cover the critical paths listed above
