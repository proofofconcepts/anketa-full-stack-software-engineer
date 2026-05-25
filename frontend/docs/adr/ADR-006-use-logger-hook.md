# ADR-006: Use `useLogger` for Component Render Debugging

## Status

Accepted

## Context

During development, diagnosing unexpected re-renders or tracking how component props change across renders requires either manual `console.log` calls or external browser devtools extensions. Ad-hoc `console.log` statements are easy to forget and get committed to the codebase accidentally.

`@mantine/hooks` is already installed (ADR-005) and ships `useLogger`, a single-purpose hook that logs a component name and an array of watched values to the console on every render. It adds zero runtime cost in production when calls are removed or guarded.

## Decision

Use `useLogger` from `@mantine/hooks` as the standard hook for component render debugging during development.

```tsx
import { useLogger } from '@mantine/hooks';

export function PollCard({ poll }: PollCardProps) {
  useLogger('PollCard', [{ pollId: poll.id }]);
  // ...
}
```

- Call `useLogger` only during active debugging sessions; remove or comment it out before committing.
- Pass the component name as the first argument and an array of watched values as the second.
- Do not use standalone `console.log` calls for render tracking — prefer `useLogger` for consistency.

## Consequences

- Render logs are structured and labelled, making them easier to scan in DevTools than bare `console.log` output.
- No new dependency — `@mantine/hooks` is already in the dependency tree.
- Developers must remember to remove `useLogger` calls before committing; a lint rule (e.g. `no-restricted-syntax` targeting `useLogger`) can enforce this if needed.
- The hook has no effect in production unless the call is left in, where it logs to the console silently without throwing.
