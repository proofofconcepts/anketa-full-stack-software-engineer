import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as client from '../../src/api/client';
import { usePollsStore } from '../../src/store/polls.store';

vi.mock('../../src/api/client', () => ({
  getPolls: vi.fn(),
  submitVote: vi.fn(),
}));

const mockPoll = {
  id: 'poll-1',
  question: 'Test?',
  options: [{ id: 'opt-1', label: 'A' }],
  _count: { votes: 0 },
};

describe('usePollsStore', () => {
  beforeEach(() => {
    usePollsStore.setState({
      polls: [],
      isLoading: false,
      isVoting: false,
      error: null,
      notice: null,
    });
  });

  afterEach(() => vi.clearAllMocks());

  // ─── loadPolls ─────────────────────────────────────────────────────────────

  describe('loadPolls', () => {
    it('populates polls state on success', async () => {
      vi.mocked(client.getPolls).mockResolvedValue([mockPoll]);

      await usePollsStore.getState().loadPolls();

      expect(usePollsStore.getState().polls).toEqual([mockPoll]);
      expect(usePollsStore.getState().isLoading).toBe(false);
      expect(usePollsStore.getState().error).toBeNull();
    });

    it('sets error state when the API call fails', async () => {
      vi.mocked(client.getPolls).mockRejectedValue(new Error('Network error'));

      await usePollsStore.getState().loadPolls();

      expect(usePollsStore.getState().error).toBe('Network error');
      expect(usePollsStore.getState().polls).toEqual([]);
      expect(usePollsStore.getState().isLoading).toBe(false);
    });
  });

  // ─── castVote ──────────────────────────────────────────────────────────────

  describe('castVote', () => {
    it('calls submitVote then reloads polls on success', async () => {
      vi.mocked(client.submitVote).mockResolvedValue(undefined as never);
      vi.mocked(client.getPolls).mockResolvedValue([mockPoll]);

      await usePollsStore.getState().castVote('poll-1', 'opt-1', 'bearer-token');

      expect(client.submitVote).toHaveBeenCalledWith(
        { pollId: 'poll-1', optionId: 'opt-1' },
        'bearer-token',
      );
      expect(client.getPolls).toHaveBeenCalledOnce();
      expect(usePollsStore.getState().notice).toBe(
        'Vote submitted successfully. Refreshing polls...',
      );
      expect(usePollsStore.getState().isVoting).toBe(false);
    });

    it('sets error state when the vote submission fails', async () => {
      vi.mocked(client.submitVote).mockRejectedValue(new Error('Forbidden'));

      await usePollsStore.getState().castVote('poll-1', 'opt-1', 'bad-token');

      expect(usePollsStore.getState().error).toBe('Forbidden');
      expect(usePollsStore.getState().isVoting).toBe(false);
    });
  });

  // ─── clearMessages ─────────────────────────────────────────────────────────

  describe('clearMessages', () => {
    it('resets error and notice to null', () => {
      usePollsStore.setState({ error: 'oops', notice: 'done' });

      usePollsStore.getState().clearMessages();

      expect(usePollsStore.getState().error).toBeNull();
      expect(usePollsStore.getState().notice).toBeNull();
    });
  });
});
