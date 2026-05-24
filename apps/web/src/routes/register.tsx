import { Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { authApi } from '@/lib/auth.api'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: '/' })
  },
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const form = useForm({
    initialValues: { email: '', username: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      username: (v) =>
        /^[a-zA-Z0-9_]{3,30}$/.test(v) ? null : '3–30 characters, letters/numbers/underscores only',
      password: (v) => (v.length >= 8 ? null : 'At least 8 characters'),
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const data = await authApi.register(values)
      setAuth(data.user, data.accessToken, data.refreshToken)
      navigate({ to: '/' })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed'
      form.setErrors({ email: msg })
    }
  })

  return (
    <Container size={420} mt={80}>
      <Title ta="center">Create account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <a href="/login" className="text-blue-500">
          Sign in
        </a>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Email" placeholder="you@example.com" {...form.getInputProps('email')} />
            <TextInput label="Username" placeholder="john_doe" {...form.getInputProps('username')} />
            <PasswordInput label="Password" {...form.getInputProps('password')} />
            <Button type="submit" fullWidth mt="xl">
              Create account
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
