import { useEffect } from 'react';
import { PollCard } from './components/PollCard';
import { useAuthStore } from './store/auth.store';
import { usePollsStore } from './store/polls.store';

export function App() {
  const { token, setToken } = useAuthStore();
  const { polls, isLoading, isVoting, error, notice, loadPolls, castVote } = usePollsStore();

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
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-16">
      <section className="mb-6">
        <p className="m-0 text-xs font-bold tracking-widest uppercase text-[#042f2e]">Anketa Web</p>
        <h1 className="mt-1 mb-2 text-[clamp(1.8rem,2.5vw,2.8rem)] font-bold leading-tight">
          Vote Today. Influence Tomorrow.
        </h1>
        <p className="text-slate-600 max-w-[60ch]">
          Frontend integration layer for the social vote backend API.
        </p>
      </section>

      <section className="my-5 p-4 rounded-2xl bg-white border border-blue-100">
        <label htmlFor="token" className="block font-semibold mb-2">
          JWT Access Token (required for vote)
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste access token from /v1/auth/login"
          className="w-full border border-slate-300 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#0ea5a4]"
        />
      </section>

      {error ? (
        <p className="my-3 px-4 py-3 rounded-xl bg-rose-100 text-rose-700">{error}</p>
      ) : null}
      {notice ? (
        <p className="my-3 px-4 py-3 rounded-xl bg-cyan-50 text-cyan-700">{notice}</p>
      ) : null}

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
    </main>
  );
}
