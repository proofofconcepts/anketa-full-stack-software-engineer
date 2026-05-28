import { afterEach, describe, expect, it } from 'vitest';
import { selectIsAuthenticated, useAuthStore } from '../../src/store/auth.store';

describe('useAuthStore', () => {
  afterEach(() => {
    useAuthStore.setState({ accessToken: '', refreshToken: '' });
  });

  // ─── setTokens ─────────────────────────────────────────────────────────────

  describe('setTokens', () => {
    it('stores both accessToken and refreshToken', () => {
      useAuthStore.getState().setTokens('access-abc', 'refresh-xyz');

      expect(useAuthStore.getState().accessToken).toBe('access-abc');
      expect(useAuthStore.getState().refreshToken).toBe('refresh-xyz');
    });
  });

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears both tokens', () => {
      useAuthStore.setState({ accessToken: 'access-abc', refreshToken: 'refresh-xyz' });

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().accessToken).toBe('');
      expect(useAuthStore.getState().refreshToken).toBe('');
    });
  });

  // ─── selectIsAuthenticated ─────────────────────────────────────────────────

  describe('selectIsAuthenticated', () => {
    it('returns true when accessToken is non-empty', () => {
      useAuthStore.setState({ accessToken: 'some-token', refreshToken: '' });

      expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);
    });

    it('returns false when accessToken is empty', () => {
      useAuthStore.setState({ accessToken: '', refreshToken: '' });

      expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
    });
  });
});
