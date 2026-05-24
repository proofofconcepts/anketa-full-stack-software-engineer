import type { PollDto } from '@anketa/shared'
import { Avatar, Badge, Card, Group, Progress, Stack, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'

interface Props {
  poll: PollDto
}

export const PollCard = memo(function PollCard({ poll }: Props) {
  const topOption = poll.options.reduce(
    (max, opt) => (opt.votesCount > max.votesCount ? opt : max),
    poll.options[0],
  )

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Link to="/profile/$username" params={{ username: poll.author.username }}>
            <Group gap="xs">
              <Avatar src={poll.author.avatar} size="sm" radius="xl" />
              <Text size="sm" fw={500}>
                @{poll.author.username}
              </Text>
            </Group>
          </Link>
          {poll.category && (
            <Badge variant="light" size="sm">
              {poll.category}
            </Badge>
          )}
        </Group>

        <Link to="/polls/$pollId" params={{ pollId: poll.id }}>
          <Text fw={600} lineClamp={2} className="hover:underline cursor-pointer">
            {poll.question}
          </Text>
        </Link>

        {topOption && poll.totalVotes > 0 && (
          <div>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed" lineClamp={1}>
                {topOption.text}
              </Text>
              <Text size="xs" fw={600}>
                {topOption.percentage}%
              </Text>
            </Group>
            <Progress value={topOption.percentage} size="sm" />
          </div>
        )}

        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
          </Text>
          <Text size="xs" c="dimmed">
            {poll.commentsCount} {poll.commentsCount === 1 ? 'comment' : 'comments'}
          </Text>
          <Text size="xs" c="dimmed">
            {new Date(poll.createdAt).toLocaleDateString()}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
})
