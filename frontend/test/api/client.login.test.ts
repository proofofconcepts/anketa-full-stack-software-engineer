import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { login } from '../../src/api/client';

describe('login()', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls POST /auth/login with email and password', async () => {
    const mockResponse = {
      accessToken: 'access-abc',
      refreshToken: 'refresh-xyz',
      tokenType: 'Bearer',
    };

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const result = await login('user@example.com', 'password123');

    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/auth\/login$/);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result).toEqual(mockResponse);
  });

  it('throws an Error with the API message on non-2xx response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 }),
    );

    await expect(login('bad@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
  });

  it('throws a generic error when the response body is not parseable', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('Internal Server Error', { status: 500 }),
    );

    await expect(login('user@example.com', 'pass')).rejects.toThrow('Request failed');
  });
});
