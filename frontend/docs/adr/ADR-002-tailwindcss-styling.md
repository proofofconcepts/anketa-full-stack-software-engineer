# ADR-002: Adopt Tailwind CSS for Frontend Styling

## Status

Accepted

## Context

The frontend currently uses a single hand-rolled `styles.css` file with custom BEM-style class names. As the component surface grows (auth forms, poll feed, vote actions), maintaining a bespoke stylesheet becomes increasingly expensive. The job description lists Tailwind CSS as a nice-to-have skill, and the `@tailwindcss/vite` plugin integrates cleanly with the existing Vite + React setup without requiring a separate PostCSS configuration.

## Decision

Replace the current `styles.css` approach with Tailwind CSS v4 as the primary utility-first styling layer. The `@tailwindcss/vite` Vite plugin is used in place of a separate PostCSS pipeline. Custom theme tokens (accent colour, font stack) are declared via the `@theme` block in `styles.css`. All component class names are migrated from BEM-style identifiers to inline Tailwind utility classes.

## Consequences

- Component markup carries utility classes directly, eliminating the round-trip cost of inventing and maintaining custom class names.
- Visual consistency is enforced through the Tailwind design-token system and the `@theme` overrides in `styles.css`.
- The existing hand-written CSS rules are removed during adoption; no legacy stylesheet is kept alongside Tailwind.
- Bundle size impact is negligible in production because Tailwind v4's JIT engine purges unused classes at build time.
- Tailwind CSS proficiency is exercised as a listed nice-to-have skill for the target role.
