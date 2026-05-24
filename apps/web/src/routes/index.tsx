import { Container, Pagination, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, memo } from 'react'
import { PollCard } from '@/components/PollCard'
import { pollsApi } from '@/lib/polls.api'

export const Route = createFileRoute('/')({
  loader: () => pollsApi.getTrending(1, 10),
  component: HomePage,
})

const PollGrid = memo(function PollGrid({ polls }: { polls: ReturnType<typeof Route.useLoaderData> }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {polls.data.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </SimpleGrid>
  )
})

function HomePage() {
  const initialData = Route.useLoaderData()
  const [page, setPage] = useState(1)
  const [data, setData] = useState(initialData)

  const totalPages = useMemo(
    () => Math.ceil(data.meta.total / data.meta.limit),
    [data.meta],
  )

  const handlePageChange = async (p: number) => {
    const result = await pollsApi.getTrending(p, 10)
    setData(result)
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={2}>Trending Polls</Title>
        {data.data.length === 0 ? (
          <Text c="dimmed">No polls yet. Be the first to create one!</Text>
        ) : (
          <PollGrid polls={data} />
        )}
        {totalPages > 1 && (
          <Pagination value={page} onChange={handlePageChange} total={totalPages} />
        )}
      </Stack>
    </Container>
  )
}
