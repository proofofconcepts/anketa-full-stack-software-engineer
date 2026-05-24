import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { pollsApi } from '@/lib/polls.api'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/polls/create')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) throw redirect({ to: '/login' })
  },
  component: CreatePollPage,
})

function CreatePollPage() {
  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      question: '',
      description: '',
      category: '',
      options: [{ text: '' }, { text: '' }],
    },
    validate: {
      question: (v) => (v.trim().length >= 5 ? null : 'At least 5 characters'),
      options: {
        text: (v) => (v.trim().length >= 1 ? null : 'Option text required'),
      },
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    const poll = await pollsApi.create({
      question: values.question,
      description: values.description || undefined,
      category: values.category || undefined,
      options: values.options.filter((o) => o.text.trim()),
    })
    navigate({ to: '/polls/$pollId', params: { pollId: poll.id } })
  })

  return (
    <Container size="sm">
      <Title order={2} mb="xl">
        Create a Poll
      </Title>
      <Paper withBorder p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Textarea
              label="Question"
              placeholder="What do you want to ask?"
              autosize
              minRows={2}
              {...form.getInputProps('question')}
            />
            <Textarea
              label="Description (optional)"
              placeholder="Add context to your poll..."
              autosize
              minRows={2}
              {...form.getInputProps('description')}
            />
            <TextInput
              label="Category (optional)"
              placeholder="e.g. Sports, Tech, Entertainment"
              {...form.getInputProps('category')}
            />

            <div>
              <Title order={5} mb="xs">
                Options
              </Title>
              <Stack gap="xs">
                {form.values.options.map((_, i) => (
                  <Group key={i} gap="xs">
                    <TextInput
                      placeholder={`Option ${i + 1}`}
                      style={{ flex: 1 }}
                      {...form.getInputProps(`options.${i}.text`)}
                    />
                    {form.values.options.length > 2 && (
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => form.removeListItem('options', i)}
                      >
                        ×
                      </ActionIcon>
                    )}
                  </Group>
                ))}
              </Stack>
              {form.values.options.length < 10 && (
                <Button
                  variant="subtle"
                  size="xs"
                  mt="xs"
                  onClick={() => form.insertListItem('options', { text: '' })}
                >
                  + Add option
                </Button>
              )}
            </div>

            <Button type="submit" mt="md">
              Create Poll
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
