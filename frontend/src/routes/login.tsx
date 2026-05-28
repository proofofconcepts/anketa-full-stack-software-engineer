import { Alert, Anchor, Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { login } from '../api/client';
import { useAuthStore } from '../store/auth.store';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setTokens } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await login(email, password);
      setTokens(accessToken, refreshToken);
      await navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-svh py-8 sm:min-h-[60vh] sm:py-0">
      <Paper shadow="md" p="xl" radius="xl" className="w-full max-w-sm">
        <Stack gap="md">
          <div>
            <Title order={2} className="text-[#042f2e]">Sign in</Title>
            <Text size="sm" c="dimmed" mt={4}>Enter your credentials to continue</Text>
          </div>

          {error ? (
            <Alert color="red" radius="md">{error}</Alert>
          ) : null}

          <form onSubmit={(e) => void handleSubmit(e)}>
            <Stack gap="sm">
              <TextInput
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                autoComplete="email"
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                mt="xs"
                style={{ backgroundColor: '#0ea5a4' }}
              >
                Sign in
              </Button>
            </Stack>
          </form>
          <Text size="sm" ta="center" c="dimmed">
            Don't have an account?{' '}
            <Anchor component={Link} to="/register" size="sm">
              Create account
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}
