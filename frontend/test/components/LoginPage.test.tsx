import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '../../src/routes/login';
import { useAuthStore } from '../../src/store/auth.store';

vi.mock('../../src/api/client', () => ({
  login: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

import * as client from '../../src/api/client';

function renderLoginPage() {
  return render(
    <MantineProvider>
      <LoginPage />
    </MantineProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: '', refreshToken: '' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password inputs', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderLoginPage();

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls login() with the entered credentials on submit', async () => {
    vi.mocked(client.login).mockResolvedValue({
      accessToken: 'access-abc',
      refreshToken: 'refresh-xyz',
      tokenType: 'Bearer',
    });
    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(client.login).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  it('stores tokens in the auth store on successful login', async () => {
    vi.mocked(client.login).mockResolvedValue({
      accessToken: 'access-abc',
      refreshToken: 'refresh-xyz',
      tokenType: 'Bearer',
    });
    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('access-abc');
      expect(useAuthStore.getState().refreshToken).toBe('refresh-xyz');
    });
  });

  it('displays the API error message when login fails', async () => {
    vi.mocked(client.login).mockRejectedValue(new Error('Invalid credentials'));
    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'bad@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
