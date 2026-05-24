import type { AuthTokensDto, LoginDto, RefreshDto, RegisterDto } from '@anketa/shared'
import { api } from './api'

export const authApi = {
  register: (dto: RegisterDto) => api.post<AuthTokensDto>('/auth/register', dto).then((r) => r.data),
  login: (dto: LoginDto) => api.post<AuthTokensDto>('/auth/login', dto).then((r) => r.data),
  refresh: (dto: RefreshDto) => api.post<AuthTokensDto>('/auth/refresh', dto).then((r) => r.data),
  logout: (dto: RefreshDto) => api.post('/auth/logout', dto),
}
