import { create } from 'zustand';
import { createPoll } from '../api/client';
import { usePollsStore } from './polls.store';

export const CREATE_POLL_QUESTION_MIN = 5;
export const CREATE_POLL_QUESTION_MAX = 300;
export const CREATE_POLL_OPTIONS_MIN = 2;
export const CREATE_POLL_OPTIONS_MAX = 6;

const INITIAL_DRAFT_OPTIONS = ['', ''];

interface CreatePollState {
  isCreating: boolean;
  draftQuestion: string;
  draftOptions: string[];
  formError: string | null;
  setDraftQuestion: (question: string) => void;
  setDraftOption: (index: number, value: string) => void;
  addDraftOption: () => void;
  removeDraftOption: (index: number) => void;
  resetDraft: () => void;
  submitCreatePoll: (token: string) => Promise<boolean>;
}

export const useCreatePollStore = create<CreatePollState>()((set, get) => ({
  isCreating: false,
  draftQuestion: '',
  draftOptions: [...INITIAL_DRAFT_OPTIONS],
  formError: null,

  setDraftQuestion: (question) => set({ draftQuestion: question, formError: null }),

  setDraftOption: (index, value) =>
    set((state) => ({
      draftOptions: state.draftOptions.map((o, i) => (i === index ? value : o)),
      formError: null,
    })),

  addDraftOption: () =>
    set((state) => {
      if (state.draftOptions.length >= CREATE_POLL_OPTIONS_MAX) return state;
      return { draftOptions: [...state.draftOptions, ''] };
    }),

  removeDraftOption: (index) =>
    set((state) => {
      if (state.draftOptions.length <= CREATE_POLL_OPTIONS_MIN) return state;
      return { draftOptions: state.draftOptions.filter((_, i) => i !== index) };
    }),

  resetDraft: () =>
    set({ draftQuestion: '', draftOptions: [...INITIAL_DRAFT_OPTIONS], formError: null }),

  submitCreatePoll: async (token) => {
    const { draftQuestion, draftOptions } = get();

    if (!token.trim()) {
      set({ formError: 'Add an access token before creating a poll.' });
      return false;
    }

    const trimmedQuestion = draftQuestion.trim();
    if (
      trimmedQuestion.length < CREATE_POLL_QUESTION_MIN ||
      trimmedQuestion.length > CREATE_POLL_QUESTION_MAX
    ) {
      set({
        formError: `Question must be between ${CREATE_POLL_QUESTION_MIN} and ${CREATE_POLL_QUESTION_MAX} characters.`,
      });
      return false;
    }

    const filledOptions = draftOptions.filter((o) => o.trim().length > 0);
    if (filledOptions.length < CREATE_POLL_OPTIONS_MIN) {
      set({ formError: `Provide at least ${CREATE_POLL_OPTIONS_MIN} non-empty options.` });
      return false;
    }

    set({ isCreating: true, formError: null });
    try {
      await createPoll({ question: trimmedQuestion, options: filledOptions }, token.trim());
      await usePollsStore.getState().loadPolls();
      get().resetDraft();
      return true;
    } catch (err) {
      set({ formError: err instanceof Error ? err.message : 'Failed to create poll' });
      return false;
    } finally {
      set({ isCreating: false });
    }
  },
}));
