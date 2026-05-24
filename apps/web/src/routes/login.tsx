import { Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { authApi } from '@/lib/auth.api'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: '/' })
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length >= 1 ? null : 'Password required'),
    },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const data = await authApi.login(values)
      setAuth(data.user, data.accessToken, data.refreshToken)
      navigate({ to: '/' })
    } catch {
      form.setErrors({ email: 'Invalid email or password' })
    }
  })

  return (
    <Container size={420} mt={80}>
      <Title ta="center">Welcome back</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500">
          Register
        </a>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Email" placeholder="you@example.com" {...form.getInputProps('email')} />
            <PasswordInput label="Password" {...form.getInputProps('password')} />
            <Button type="submit" fullWidth mt="xl">
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
