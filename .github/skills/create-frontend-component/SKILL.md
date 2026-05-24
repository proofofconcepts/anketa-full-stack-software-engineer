---
name: create-frontend-component
description: 'Create a new React frontend component and its companion Zustand store in this repository. Use when asked to create a component, add a UI feature, or implement a new interactive form or section. Enforces the no-useState, store-first conventions established in this project.'
argument-hint: 'component name and purpose, for example: DeletePollButton that allows poll authors to delete their poll'
user-invocable: true
---

# Create Frontend Component

Create a new React component and, if needed, a companion Zustand store, following this repository's frontend conventions.

## When to Use

- The user asks to create a new React component.
- A new UI feature or interactive section needs implementing.
- A form, button group, or data-display section needs adding to the frontend.

## Repository Conventions

### No useState

Components in this project do not use React's `useState`. All mutable state lives in a Zustand store. This keeps components as pure, predictable, presentation-only layers.

### One store per component concern

Each feature area that requires state gets its own store file. Do not add unrelated state to an existing store. Assess whether an existing store already covers the new component's concern before creating a new one.

Good reasons to create a new store:
- The component manages its own form draft state (e.g. `create-poll.store.ts` for `CreatePollForm`).
- The component has loading or async state that is independent from existing stores.

Good reasons to reuse an existing store:
- The component is a read-only view of data already in `polls.store.ts`.
- The component only needs `token` from `auth.store.ts`.

### Store-first business logic

All validation rules, constraints, and async API calls live in the store, not the component. The component calls a single store action on submit and displays store-derived state.

### Cross-store communication

When a store needs to trigger a side-effect in another store (e.g. reload the poll list after creating a poll), use `useOtherStore.getState().action()` inside the acting store. Never import one store into a component just to call a cross-cutting action.

### File locations

- Components: `frontend/src/components/ComponentName.tsx`
- Store: `frontend/src/store/feature-name.store.ts`
- Shared types: `frontend/src/types/domain.ts`

### Styling

Use Tailwind CSS v4 utility classes only. No BEM, no inline `style` attributes, no CSS modules.

## Procedure

### 1. Assess state needs

Determine whether the component needs its own store:
- Does it hold mutable input state (form fields, toggles, selections)?
- Does it trigger async operations?

If yes to either → create a new store. If no → the component can be a stateless functional component that reads from an existing store or receives props.

### 2. Determine if a new type is needed

Check `frontend/src/types/` for existing type definitions. Add only what is missing to the appropriate domain type file. Do not create a new types file unless no suitable one exists.

### 3. Create the store (if needed)

Use the template in [store-template.ts](./assets/store-template.ts).

- Name the store `use<FeatureName>Store` in `frontend/src/store/<feature-name>.store.ts`.
- Export domain constants (min/max lengths, limits) from the store so the component can reference them without duplicating values.
- Implement all validation logic inside the submit action in the store.
- Return `boolean` from async submit actions so the component can react to success/failure without coupling to implementation details.
- For cross-store side-effects, call `useOtherStore.getState().method()` inside the store action.

### 4. Create the component

Use the template in [component-template.tsx](./assets/component-template.tsx).

- Place it in `frontend/src/components/<ComponentName>.tsx`.
- Import state and actions from the companion store.
- Import token from `useAuthStore` only when authentication gating is required.
- Import exported constants from the store for use in HTML attributes (e.g. `maxLength`).
- Do not use `useState`, `useReducer`, or `useRef` for form field values.
- Keep the `handleSubmit` function a thin event-handler wrapper: call `event.preventDefault()` then the store action.
- Display `formError` from the store inline — do not derive or compute error messages in the component.

### 5. Mount the component

Identify the parent component or page where the new component should appear. Add the import and place the JSX element at the appropriate location.

### 6. Verify

Run the build to confirm no TypeScript errors were introduced:

```
cd frontend && npm run build
```

Fix any type errors before considering the task done.

## Output Expectations

- Create exactly the files needed (store + component + type additions).
- Do not add extra abstractions, helpers, or HOCs unless explicitly requested.
- Component must compile cleanly with no `useState` imports.
