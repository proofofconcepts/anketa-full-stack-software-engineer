import type { Poll } from '../types/poll';

interface PollCardProps {
  poll: Poll;
  isVoting: boolean;
  onVote: (pollId: string, optionId: string) => void;
}

export function PollCard({ poll, isVoting, onVote }: PollCardProps) {
  return (
    <article className="poll-card">
      <header className="poll-card-header">
        <h2>{poll.question}</h2>
        <span className="vote-count">{poll._count?.votes ?? 0} votes</span>
      </header>

      <div className="option-grid">
        {poll.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={isVoting}
            onClick={() => onVote(poll.id, option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
}
