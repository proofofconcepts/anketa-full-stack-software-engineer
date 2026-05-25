# ADR-004: TanStack Router for Client-Side Navigation

## Status

Accepted

## Context

The frontend started as a single-page application with no routing layer — all content rendered inside a single `App` component. Adding a dedicated "create poll" flow highlighted the need for distinct, bookmarkable routes rather than conditionally toggling UI sections inside one component. A routing solution was required to support:

- A `/` feed route for browsing and voting on polls.
- A `/polls/new` route for the create poll form.
- A shared root layout (header, token input, global notifications) rendered across all routes.
- Type-safe navigation and link components.

TanStack Router was chosen over React Router because it is listed as a nice-to-have technology in the target job description for this study project, and it provides first-class TypeScript support with end-to-end type safety on route params and navigation calls.

## Decision

Adopt **TanStack Router** (`@tanstack/react-router`) for all client-side routing in the frontend using the **code-based routing** approach (no file-system plugin required).

The route tree is defined in `src/router.ts`:

- Root route → `src/routes/__root.tsx` (shared layout with `<Outlet />`)
- `/` → `src/routes/feed.tsx` (poll feed page)
- `/polls/new` → `src/routes/polls.new.tsx` (create poll page)

`main.tsx` mounts `<RouterProvider router={router} />` as the application entry point. `App.tsx` was removed as it is fully superseded by the route tree.

Navigation between routes uses TanStack Router's `<Link>` component with `activeProps` for active-link styling, and `useNavigate` for programmatic navigation (e.g. redirect to `/` after a successful poll creation).

## Consequences

- Route components are thin page-level wrappers; business logic stays in Zustand stores.
- `CreatePollForm` gained an optional `onSuccess` callback so the page route can navigate after a successful submit without coupling navigation to the store.
- The `Register` interface augmentation in `router.ts` enables fully type-safe `<Link to=...>` and `navigate({ to: ... })` calls across the codebase.
- Adding future routes (e.g. `/polls/:id`) requires only a new `createRoute` entry in `router.ts` and a corresponding route component — no config files or plugins needed.
- Code-based routing produces a slightly more verbose setup than file-based routing, but avoids a Vite plugin dependency and keeps the full route tree visible in one file.
