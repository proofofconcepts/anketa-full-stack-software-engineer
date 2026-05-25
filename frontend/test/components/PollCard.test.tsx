import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Poll } from '../../src/types/poll';
import { PollCard } from '../../src/components/PollCard';

vi.mock('@mantine/hooks', () => ({ useLogger: vi.fn() }));

const mockPoll: Poll = {
  id: 'poll-1',
  question: 'Best frontend framework?',
  options: [
    { id: 'opt-1', label: 'React' },
    { id: 'opt-2', label: 'Vue' },
  ],
  _count: { votes: 5 },
};

describe('PollCard', () => {
  it('renders the poll question', () => {
    render(<PollCard poll={mockPoll} isVoting={false} onVote={vi.fn()} />);

    expect(screen.getByText('Best frontend framework?')).toBeInTheDocument();
  });

  it('renders all option buttons', () => {
    render(<PollCard poll={mockPoll} isVoting={false} onVote={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vue' })).toBeInTheDocument();
  });

  it('displays the vote count', () => {
    render(<PollCard poll={mockPoll} isVoting={false} onVote={vi.fn()} />);

    expect(screen.getByText('5 votes')).toBeInTheDocument();
  });

  it('calls onVote with the correct pollId and optionId when an option is clicked', async () => {
    const onVote = vi.fn();
    render(<PollCard poll={mockPoll} isVoting={false} onVote={onVote} />);

    await userEvent.click(screen.getByRole('button', { name: 'React' }));

    expect(onVote).toHaveBeenCalledOnce();
    expect(onVote).toHaveBeenCalledWith('poll-1', 'opt-1');
  });

  it('disables all option buttons while isVoting is true', () => {
    render(<PollCard poll={mockPoll} isVoting={true} onVote={vi.fn()} />);

    screen
      .getAllByRole('button')
      .forEach((button) => expect(button).toBeDisabled());
  });

  it('shows 0 votes when _count is absent', () => {
    const pollWithoutCount: Poll = { ...mockPoll, _count: undefined };
    render(<PollCard poll={pollWithoutCount} isVoting={false} onVote={vi.fn()} />);

    expect(screen.getByText('0 votes')).toBeInTheDocument();
  });
});
