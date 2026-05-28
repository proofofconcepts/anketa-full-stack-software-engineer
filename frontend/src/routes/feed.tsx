import { useEffect } from 'react';
import { PollCard } from '../components/PollCard';
import { useAuthStore } from '../store/auth.store';
import { usePollsStore } from '../store/polls.store';

export function FeedPage() {
  const { accessToken } = useAuthStore();
  const { polls, isLoading, isVoting, loadPolls, castVote } = usePollsStore();

  async function onVote(pollId: string, optionId: string) {
    await castVote(pollId, optionId, accessToken);
  }

  useEffect(() => {
    void loadPolls();
  }, [loadPolls]);

  if (isLoading && polls.length === 0) {
    return <p className="text-center py-12 text-slate-400">Loading polls…</p>;
  }

  return (
    <section className="grid gap-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} isVoting={isVoting} onVote={onVote} />
      ))}

      {polls.length === 0 ? (
        <p className="text-slate-600 text-center">No polls available yet.</p>
      ) : null}
    </section>
  );
}
