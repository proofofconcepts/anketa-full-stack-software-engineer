import { useEffect, useMemo, useState } from 'react';
import { getPolls, submitVote } from './api/client';
import { PollCard } from './components/PollCard';
import type { Poll } from './types/poll';

export function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [token, setToken] = useState('');

  const sortedPolls = useMemo(() => polls, [polls]);

  async function loadPolls() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPolls();
      setPolls(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load polls');
    } finally {
      setIsLoading(false);
    }
  }

  async function onVote(pollId: string, optionId: string) {
    if (!token.trim()) {
      setNotice('Add an access token before voting.');
      return;
    }

    try {
      setIsVoting(true);
      setError(null);
      setNotice(null);
      await submitVote({ pollId, optionId }, token.trim());
      setNotice('Vote submitted successfully. Refreshing polls...');
      await loadPolls();
    } catch (voteError) {
      setError(voteError instanceof Error ? voteError.message : 'Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  }

  useEffect(() => {
    void loadPolls();
  }, []);

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
        {sortedPolls.map((poll) => (
          <PollCard key={poll.id} poll={poll} isVoting={isVoting} onVote={onVote} />
        ))}

        {!isLoading && sortedPolls.length === 0 ? (
          <p className="text-slate-600 text-center">No polls available yet.</p>
        ) : null}
      </section>
    </main>
  );
}
