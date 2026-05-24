import type { VoteResultsDto } from '@anketa/shared'
import {
  Avatar,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react'
import { OptionBar } from '@/components/OptionBar'
import { UserAvatar } from '@/components/UserAvatar'
import { pollsApi } from '@/lib/polls.api'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/polls/$pollId')({
  loader: async ({ params }) => {
    try {
      const [poll, comments] = await Promise.all([
        pollsApi.getOne(params.pollId),
        pollsApi.getComments(params.pollId),
      ])
      return { poll, comments }
    } catch {
      throw notFound()
    }
  },
  component: PollDetailPage,
})

function PollDetailPage() {
  const { poll: initialPoll, comments: initialComments } = Route.useLoaderData()
  const { isAuthenticated } = useAuthStore()

  const [poll, setPoll] = useState(initialPoll)
  const [comments, setComments] = useState(initialComments)
  const [voting, setVoting] = useState(false)

  const commentForm = useForm({ initialValues: { content: '' } })

  const handleVote = useCallback(
    async (optionId: string) => {
      if (!isAuthenticated || poll.hasVoted) return
      setVoting(true)
      try {
        const results: VoteResultsDto = await pollsApi.castVote(poll.id, { optionId })
        setPoll((prev) => ({
          ...prev,
          hasVoted: true,
          userVotedOptionId: optionId,
          totalVotes: results.totalVotes,
          options: prev.options.map((o) => {
            const updated = results.options.find((r) => r.id === o.id)
            return updated ?? o
          }),
        }))
      } finally {
        setVoting(false)
      }
    },
    [isAuthenticated, poll.hasVoted, poll.id],
  )

  const handleComment = commentForm.onSubmit(async (values) => {
    const comment = await pollsApi.addComment(poll.id, values)
    setComments((prev) => ({ ...prev, data: [comment, ...prev.data] }))
    commentForm.reset()
  })

  const isExpired = useMemo(
    () => poll.expiresAt != null && new Date(poll.expiresAt) < new Date(),
    [poll.expiresAt],
  )

  return (
    <Container size="sm">
      <Stack gap="xl">
        <Paper withBorder p="xl" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <UserAvatar user={poll.author} />
              <Group gap="xs">
                {poll.category && <Badge variant="light">{poll.category}</Badge>}
                {isExpired && <Badge color="red">Expired</Badge>}
              </Group>
            </Group>

            <Title order={3}>{poll.question}</Title>
            {poll.description && <Text c="dimmed">{poll.description}</Text>}

            <Stack gap="xs">
              {poll.options.map((option) => (
                <OptionBar
                  key={option.id}
                  option={option}
                  selected={poll.userVotedOptionId === option.id}
                  hasVoted={poll.hasVoted || isExpired || !isAuthenticated || voting}
                  onVote={handleVote}
                />
              ))}
            </Stack>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
              </Text>
              {!isAuthenticated && (
                <Text size="xs" c="dimmed">
                  Login to vote
                </Text>
              )}
            </Group>
          </Stack>
        </Paper>

        <Divider label="Comments" labelPosition="center" />

        {isAuthenticated && (
          <form onSubmit={handleComment}>
            <Stack gap="xs">
              <Textarea
                placeholder="Add a comment..."
                autosize
                minRows={2}
                {...commentForm.getInputProps('content')}
              />
              <Button type="submit" size="sm" ml="auto">
                Comment
              </Button>
            </Stack>
          </form>
        )}

        <Stack gap="md">
          {comments.data.map((comment) => (
            <Paper key={comment.id} withBorder p="md" radius="md">
              <Group gap="sm" align="flex-start">
                <Avatar src={comment.author.avatar} size="sm" radius="xl" />
                <div style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      @{comment.author.username}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </Group>
                  <Text size="sm" mt={4}>
                    {comment.content}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
