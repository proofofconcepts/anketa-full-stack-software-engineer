import type { PollDto } from '@anketa/shared'
import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PollCard } from './PollCard'

// TanStack Router Link requires a router context — mock it
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<object>) => (
    <a {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  ),
}))

const mockPoll: PollDto = {
  id: 'poll-1',
  question: 'What is your favorite color?',
  description: null,
  category: 'General',
  expiresAt: null,
  totalVotes: 10,
  commentsCount: 3,
  hasVoted: false,
  userVotedOptionId: null,
  author: {
    id: 'user-1',
    email: 'user@example.com',
    username: 'testuser',
    avatar: null,
    bio: null,
    followersCount: 5,
    followingCount: 2,
    pollsCount: 1,
    isFollowing: false,
    createdAt: new Date().toISOString(),
  },
  options: [
    { id: 'opt-1', text: 'Red', imageUrl: null, votesCount: 7, percentage: 70 },
    { id: 'opt-2', text: 'Blue', imageUrl: null, votesCount: 3, percentage: 30 },
  ],
  createdAt: new Date().toISOString(),
}

function renderWithProviders(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('PollCard', () => {
  it('renders the poll question', () => {
    renderWithProviders(<PollCard poll={mockPoll} />)
    expect(screen.getByText('What is your favorite color?')).toBeDefined()
  })

  it('shows vote count', () => {
    renderWithProviders(<PollCard poll={mockPoll} />)
    expect(screen.getByText('10 votes')).toBeDefined()
  })

  it('shows category badge', () => {
    renderWithProviders(<PollCard poll={mockPoll} />)
    expect(screen.getByText('General')).toBeDefined()
  })

  it('shows the author username', () => {
    renderWithProviders(<PollCard poll={mockPoll} />)
    expect(screen.getByText('@testuser')).toBeDefined()
  })

  it('shows top option progress bar', () => {
    renderWithProviders(<PollCard poll={mockPoll} />)
    expect(screen.getByText('70%')).toBeDefined()
  })
})
