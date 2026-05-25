import type { CreatePollPayload, CreateVotePayload, Poll } from '../types/poll';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = typeof data?.message === 'string' ? data.message : 'Request failed';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function getPolls() {
  return request<Poll[]>('/polls');
}

export function submitVote(payload: CreateVotePayload, accessToken: string) {
  return request('/votes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export function createPoll(payload: CreatePollPayload, accessToken: string) {
  return request<Poll>('/polls', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}
