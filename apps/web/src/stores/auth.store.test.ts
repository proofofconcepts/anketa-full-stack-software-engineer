import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './auth.store'

const mockUser = {
  id: 'u1',
  email: 'test@example.com',
  username: 'testuser',
  avatar: null,
  bio: null,
  followersCount: 0,
  followingCount: 0,
  pollsCount: 0,
  isFollowing: false,
  createdAt: new Date().toISOString(),
}

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('setAuth stores user and tokens', () => {
    useAuthStore.getState().setAuth(mockUser, 'access-tok', 'refresh-tok')
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.username).toBe('testuser')
    expect(state.accessToken).toBe('access-tok')
  })

  it('logout clears all auth state', () => {
    useAuthStore.getState().setAuth(mockUser, 'access-tok', 'refresh-tok')
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
  })

  it('setTokens updates tokens without changing user', () => {
    useAuthStore.getState().setAuth(mockUser, 'old-access', 'old-refresh')
    useAuthStore.getState().setTokens('new-access', 'new-refresh')
    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('new-access')
    expect(state.refreshToken).toBe('new-refresh')
    expect(state.user?.username).toBe('testuser')
  })
})
