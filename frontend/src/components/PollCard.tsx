import { memo } from 'react';
import { useLogger } from '@mantine/hooks';
import type { Poll } from '../types/poll';

interface PollCardProps {
  poll: Poll;
  isVoting: boolean;
  onVote: (pollId: string, optionId: string) => void;
}

export const PollCard = memo(function PollCard({ poll, isVoting, onVote }: PollCardProps) {
  useLogger('PollCard', [{ pollId: poll.id, isVoting }]);
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-4">
      <header className="flex justify-between items-start gap-4 mb-3">
        <h2 className="m-0 text-lg font-semibold">{poll.question}</h2>
        <span className="text-slate-600 text-sm shrink-0">{poll._count?.votes ?? 0} votes</span>
      </header>

      <div className="flex flex-wrap gap-2">
        {poll.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={isVoting}
            onClick={() => onVote(poll.id, option.id)}
            className="border-0 rounded-full bg-[#0ea5a4] text-white px-4 py-2.5 min-h-[44px] cursor-pointer font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
});
