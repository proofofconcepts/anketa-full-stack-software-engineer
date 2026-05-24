import {
  Avatar,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { PollCard } from '@/components/PollCard'
import { usersApi } from '@/lib/users.api'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/profile/$username')({
  loader: async ({ params }) => {
    try {
      const [user, polls] = await Promise.all([
        usersApi.getByUsername(params.username),
        usersApi.getUserPolls(params.username),
      ])
      return { user, polls }
    } catch {
      throw notFound()
    }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { user: initialUser, polls } = Route.useLoaderData()
  const { isAuthenticated, user: me } = useAuthStore()

  const [profileUser, setProfileUser] = useState(initialUser)
  const [following, setFollowing] = useState(initialUser.isFollowing)

  const isOwn = me?.id === profileUser.id

  const handleFollow = useCallback(async () => {
    if (following) {
      await usersApi.unfollow(profileUser.id)
      setFollowing(false)
      setProfileUser((u) => ({ ...u, followersCount: u.followersCount - 1 }))
    } else {
      await usersApi.follow(profileUser.id)
      setFollowing(true)
      setProfileUser((u) => ({ ...u, followersCount: u.followersCount + 1 }))
    }
  }, [following, profileUser.id])

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Paper withBorder p="xl" radius="md">
          <Group gap="xl">
            <Avatar src={profileUser.avatar} size={80} radius="xl" />
            <Stack gap={4} style={{ flex: 1 }}>
              <Title order={3}>@{profileUser.username}</Title>
              {profileUser.bio && <Text c="dimmed">{profileUser.bio}</Text>}
              <Group gap="xl" mt="xs">
                <Text size="sm">
                  <strong>{profileUser.pollsCount}</strong> polls
                </Text>
                <Text size="sm">
                  <strong>{profileUser.followersCount}</strong> followers
                </Text>
                <Text size="sm">
                  <strong>{profileUser.followingCount}</strong> following
                </Text>
              </Group>
            </Stack>
            {isAuthenticated && !isOwn && (
              <Button
                variant={following ? 'default' : 'filled'}
                onClick={handleFollow}
              >
                {following ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Group>
        </Paper>

        <Title order={4}>Polls</Title>
        {polls.data.length === 0 ? (
          <Text c="dimmed">No polls yet.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {polls.data.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  )
}

