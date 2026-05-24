import { Container, Pagination, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { PollCard } from '@/components/PollCard'
import { pollsApi } from '@/lib/polls.api'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/following')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) throw redirect({ to: '/login' })
  },
  loader: () => pollsApi.getFollowing(1, 10),
  component: FollowingPage,
})

function FollowingPage() {
  const initialData = Route.useLoaderData()
  const [page, setPage] = useState(1)
  const [data, setData] = useState(initialData)
  const totalPages = Math.ceil(data.meta.total / data.meta.limit)

  const handlePageChange = async (p: number) => {
    const result = await pollsApi.getFollowing(p, 10)
    setData(result)
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={2}>Following Feed</Title>
        {data.data.length === 0 ? (
          <Text c="dimmed">No polls from people you follow yet. Follow some users to see their polls here.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {data.data.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </SimpleGrid>
        )}
        {totalPages > 1 && (
          <Pagination value={page} onChange={handlePageChange} total={totalPages} />
        )}
      </Stack>
    </Container>
  )
}
