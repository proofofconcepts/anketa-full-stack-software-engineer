import { useEffect } from 'react';
import { PollCard } from '../components/PollCard';
import { useAuthStore } from '../store/auth.store';
import { usePollsStore } from '../store/polls.store';

export function FeedPage() {
  const { token } = useAuthStore();
  const { polls, isLoading, isVoting, loadPolls, castVote } = usePollsStore();

  async function onVote(pollId: string, optionId: string) {
    if (!token.trim()) {
      usePollsStore.setState({ notice: 'Add an access token before voting.' });
      return;
    }
    await castVote(pollId, optionId, token.trim());
  }

  useEffect(() => {
    void loadPolls();
  }, [loadPolls]);

  return (
    <>
      <section className="my-4">
        <button
          type="button"
          onClick={() => void loadPolls()}
          disabled={isLoading}
          className="border-0 rounded-full bg-[#0ea5a4] text-white px-4 py-2.5 cursor-pointer font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Refresh Polls'}
        </button>
      </section>

      <section className="grid gap-4">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} isVoting={isVoting} onVote={onVote} />
        ))}

        {!isLoading && polls.length === 0 ? (
          <p className="text-slate-600 text-center">No polls available yet.</p>
        ) : null}
      </section>
    </>
  );
}
