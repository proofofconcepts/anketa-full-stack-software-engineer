import { create } from 'zustand';
import { getPolls, submitVote } from '../api/client';
import type { Poll } from '../types/poll';

interface PollsState {
  polls: Poll[];
  isLoading: boolean;
  isVoting: boolean;
  error: string | null;
  notice: string | null;
  loadPolls: () => Promise<void>;
  castVote: (pollId: string, optionId: string, token: string) => Promise<void>;
  clearMessages: () => void;
}

export const usePollsStore = create<PollsState>()((set, get) => ({
  polls: [],
  isLoading: false,
  isVoting: false,
  error: null,
  notice: null,

  loadPolls: async () => {
    set({ isLoading: true, error: null });
    try {
      const polls = await getPolls();
      set({ polls });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load polls' });
    } finally {
      set({ isLoading: false });
    }
  },

  castVote: async (pollId, optionId, token) => {
    set({ isVoting: true, error: null, notice: null });
    try {
      await submitVote({ pollId, optionId }, token);
      set({ notice: 'Vote submitted successfully. Refreshing polls...' });
      await get().loadPolls();
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to submit vote' });
    } finally {
      set({ isVoting: false });
    }
  },

  clearMessages: () => set({ error: null, notice: null }),
}));
