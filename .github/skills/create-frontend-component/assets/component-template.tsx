// COMPONENT_NAME.tsx
// Follows the frontend component conventions for this repository.
// - No useState: all state lives in a Zustand store.
// - No business logic: validation and async actions live in the store.
// - Pure presentation: reads state and calls actions from the store.

import { useAuthStore } from '../store/auth.store';
import { useSTORE_NAMEStore } from '../store/STORE_NAME.store';

export function COMPONENT_NAME() {
  // Read auth token only when the component needs to gate on authentication.
  const { token } = useAuthStore();

  // Destructure only the slice of state and actions this component uses.
  const {
    // ...state slices
    // ...actions
  } = useSTORE_NAMEStore();

  return (
    <section className="">
      {/* Component markup */}
    </section>
  );
}
