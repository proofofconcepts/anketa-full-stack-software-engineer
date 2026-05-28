import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterPage } from '../../src/routes/register';
import { useAuthStore } from '../../src/store/auth.store';

vi.mock('../../src/api/client', () => ({
  register: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

import * as client from '../../src/api/client';

function renderRegisterPage() {
  return render(
    <MantineProvider>
      <RegisterPage />
    </MantineProvider>,
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: '', refreshToken: '' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders display name, email, and password inputs', () => {
    renderRegisterPage();

    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderRegisterPage();

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders a link back to the sign in page', () => {
    renderRegisterPage();

    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls register() with the entered values on submit', async () => {
    vi.mocked(client.register).mockResolvedValue({
      accessToken: 'access-abc',
      refreshToken: 'refresh-xyz',
      tokenType: 'Bearer',
    });
    renderRegisterPage();

    await userEvent.type(screen.getByLabelText(/display name/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(client.register).toHaveBeenCalledWith('alice@example.com', 'password123', 'Alice');
  });

  it('stores tokens in the auth store on successful registration', async () => {
    vi.mocked(client.register).mockResolvedValue({
      accessToken: 'access-abc',
      refreshToken: 'refresh-xyz',
      tokenType: 'Bearer',
    });
    renderRegisterPage();

    await userEvent.type(screen.getByLabelText(/display name/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('access-abc');
      expect(useAuthStore.getState().refreshToken).toBe('refresh-xyz');
    });
  });

  it('displays the API error message when registration fails', async () => {
    vi.mocked(client.register).mockRejectedValue(new Error('Email already registered'));
    renderRegisterPage();

    await userEvent.type(screen.getByLabelText(/display name/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });
  });
});
