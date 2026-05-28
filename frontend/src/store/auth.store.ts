import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string;
  refreshToken: string;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const selectIsAuthenticated = (s: AuthState) => s.accessToken.length > 0;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      refreshToken: '',
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => set({ accessToken: '', refreshToken: '' }),
    }),
    { name: 'anketa-auth' },
  ),
);
