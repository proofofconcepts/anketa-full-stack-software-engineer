// STORE_NAME.store.ts
// Zustand store scoped to a single component or feature concern.
// - All component state lives here (no useState in the component).
// - All validation and business logic live here.
// - Async side-effects (API calls, cross-store triggers) live here.

import { create } from 'zustand';
// Import API client functions for this store's domain.
// import { apiFunction } from '../api/client';

// Export domain constants so the component can reference them
// for attributes such as maxLength without duplicating magic numbers.
export const FEATURE_FIELD_MIN = 0;
export const FEATURE_FIELD_MAX = 100;

interface STOREState {
  // Async / loading flags
  isLoading: boolean;

  // Domain state
  // fieldValue: string;

  // Validation / feedback
  formError: string | null;

  // Actions
  // setFieldValue: (value: string) => void;
  // submit: (token: string) => Promise<boolean>;
  resetForm: () => void;
}

export const useSTORE_NAMEStore = create<STOREState>()((set, get) => ({
  isLoading: false,
  // fieldValue: '',
  formError: null,

  // setFieldValue: (value) => set({ fieldValue: value, formError: null }),

  // submit: async (token) => {
  //   // 1. Validate
  //   if (!token.trim()) {
  //     set({ formError: 'Authentication required.' });
  //     return false;
  //   }
  //
  //   // 2. Business rules
  //   const { fieldValue } = get();
  //   if (fieldValue.trim().length < FEATURE_FIELD_MIN) {
  //     set({ formError: `Value must be at least ${FEATURE_FIELD_MIN} characters.` });
  //     return false;
  //   }
  //
  //   // 3. API call
  //   set({ isLoading: true, formError: null });
  //   try {
  //     await apiFunction({ field: fieldValue.trim() }, token.trim());
  //     get().resetForm();
  //     return true;
  //   } catch (err) {
  //     set({ formError: err instanceof Error ? err.message : 'Unexpected error.' });
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  resetForm: () => set({ formError: null }),
}));
