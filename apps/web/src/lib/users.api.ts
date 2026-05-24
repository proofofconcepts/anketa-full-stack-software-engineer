import type { PollListDto, UpdateProfileDto, UserDto } from '@anketa/shared'
import { api } from './api'

export const usersApi = {
  getMe: () => api.get<UserDto>('/users/me').then((r) => r.data),
  updateProfile: (dto: UpdateProfileDto) => api.patch<UserDto>('/users/me', dto).then((r) => r.data),
  getByUsername: (username: string) => api.get<UserDto>(`/users/${username}`).then((r) => r.data),
  follow: (id: string) => api.post(`/users/${id}/follow`),
  unfollow: (id: string) => api.delete(`/users/${id}/follow`),
  getUserPolls: (username: string, page = 1, limit = 10) =>
    api
      .get<PollListDto>(`/users/${username}/polls`, { params: { page, limit } })
      .then((r) => r.data),
}
