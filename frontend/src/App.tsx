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
    <main className="layout">
      <section className="hero">
        <p className="eyebrow">Anketa Web</p>
        <h1>Vote Today. Influence Tomorrow.</h1>
        <p className="subtitle">
          Frontend integration layer for the social vote backend API.
        </p>
      </section>

      <section className="token-box">
        <label htmlFor="token">JWT Access Token (required for vote)</label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste access token from /v1/auth/login"
        />
      </section>

      {error ? <p className="message error">{error}</p> : null}
      {notice ? <p className="message notice">{notice}</p> : null}

      <section className="toolbar">
        <button type="button" onClick={() => void loadPolls()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh Polls'}
        </button>
      </section>

      <section className="poll-list">
        {sortedPolls.map((poll) => (
          <PollCard key={poll.id} poll={poll} isVoting={isVoting} onVote={onVote} />
        ))}

        {!isLoading && sortedPolls.length === 0 ? (
          <p className="empty">No polls available yet.</p>
        ) : null}
      </section>
    </main>
  );
}
