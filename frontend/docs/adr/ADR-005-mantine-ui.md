# ADR-005: Adopt Mantine UI as the Component Library

**Status:** Accepted  
**Date:** 2025-05-25  
**Deciders:** Frontend team

---

## Context

The Anketa frontend uses Tailwind CSS v4 for utility-class styling. While Tailwind covers layout and spacing well, building accessible, interactive components (modals, toasts, form controls, etc.) from scratch adds maintenance cost and risk. A component library that handles accessibility and interaction patterns out-of-the-box will accelerate feature development.

The job description explicitly lists **Mantine** as a nice-to-have skill alongside Vite, TanStack Router, Zustand, and Tailwind CSS, making it a natural fit for this study project.

---

## Decision

Adopt **Mantine v7** (`@mantine/core`, `@mantine/hooks`) as the UI component library.

**Version rationale:** Mantine v9 requires React 19. The project targets React 18; therefore v7, the last major release supporting React 18, is used.

---

## Division of Responsibility

| Concern                        | Tool       |
|-------------------------------|------------|
| Layout, spacing, typography   | Tailwind   |
| Utility classes, responsive   | Tailwind   |
| Interactive components        | Mantine    |
| Accessible form controls      | Mantine    |
| Modals, notifications, menus  | Mantine    |
| Custom design tokens          | Tailwind `@theme` block |
| Mantine theme overrides       | `MantineProvider` `theme` prop |

**Rule:** Prefer Mantine components for interactive UI. Use Tailwind classes for layout and composition around Mantine components. Do not duplicate components — if Mantine provides it, use it.

---

## Implementation

### Packages

```
npm install @mantine/core@7 @mantine/hooks@7
npm install --save-dev postcss postcss-preset-mantine@1 postcss-simple-vars
```

### PostCSS config (`frontend/postcss.config.cjs`)

Mantine v7 requires `postcss-preset-mantine` to compile its CSS. Tailwind v4 uses the `@tailwindcss/vite` Vite plugin (not PostCSS), so the two pipelines are independent and do not conflict.

```js
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

### Provider setup (`src/routes/__root.tsx`)

```tsx
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export function RootLayout() {
  return (
    <MantineProvider>
      <main>...</main>
    </MantineProvider>
  );
}
```

`@mantine/core/styles.css` must be imported before any other CSS to ensure Mantine's CSS layer is established first.

---

## Consequences

### Positive

- Accessible interactive components (modals, toasts, drawers) without custom implementation.
- `@mantine/hooks` provides useful utilities (`useLocalStorage`, `useMediaQuery`, etc.).
- Tailwind continues to handle all layout and spacing, keeping the existing design system intact.
- The PostCSS and Vite pipelines are independent, so no tooling conflicts.

### Negative

- Adds ~150 KB to the bundle (Mantine core styles + components). Tree-shaking reduces this in practice.
- Developers must be aware of the Tailwind/Mantine boundary to avoid duplication.
- Pinned to v7 until the project upgrades to React 19.

### Neutral

- Mantine's CSS variables can be mapped to the existing Tailwind `@theme` tokens in `styles.css` if visual consistency is needed at a later stage.
