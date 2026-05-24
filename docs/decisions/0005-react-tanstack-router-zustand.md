# ADR-0005: React Frontend with Vite, TanStack Router, Zustand, Mantine UI, and Tailwind CSS

## Status
Accepted

## Context
The web frontend needs a modern React setup with type-safe routing, lightweight global state, a component library for rapid UI development, and utility-first CSS for custom styles.

## Decision
- **Vite** — fast dev server and build tool; native ESM, HMR out of the box.
- **TanStack Router** — fully type-safe file-based routing with built-in loaders for data fetching before render; replaces React Router.
- **Zustand** — minimal global state for auth (token, user) and transient UI state; avoids Redux boilerplate.
- **Mantine UI** — comprehensive component library with form, modal, and layout primitives; reduces custom UI work.
- **Tailwind CSS** — utility classes for spacing, color, and responsive overrides where Mantine's defaults fall short.

## Consequences
- TanStack Router's loader pattern means data is fetched before the component renders, avoiding loading spinners in most cases.
- Zustand's `persist` middleware handles token storage in localStorage automatically.
- Mantine and Tailwind can conflict on class specificity — Tailwind's `preflight` reset should be disabled or scoped to avoid overriding Mantine's base styles.
