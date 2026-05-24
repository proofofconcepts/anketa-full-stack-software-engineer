import type {
  CreatePollDto,
  PollDto,
  PollListDto,
  VoteResultsDto,
  CastVoteDto,
  CommentListDto,
  CreateCommentDto,
  CommentDto,
} from '@anketa/shared'
import { api } from './api'

export const pollsApi = {
  getTrending: (page = 1, limit = 10, category?: string) =>
    api
      .get<PollListDto>('/polls', { params: { page, limit, category } })
      .then((r) => r.data),

  getFollowing: (page = 1, limit = 10) =>
    api.get<PollListDto>('/polls/following', { params: { page, limit } }).then((r) => r.data),

  getOne: (id: string) => api.get<PollDto>(`/polls/${id}`).then((r) => r.data),

  create: (dto: CreatePollDto) => api.post<PollDto>('/polls', dto).then((r) => r.data),

  remove: (id: string) => api.delete(`/polls/${id}`),

  castVote: (pollId: string, dto: CastVoteDto) =>
    api.post<VoteResultsDto>(`/polls/${pollId}/vote`, dto).then((r) => r.data),

  getResults: (pollId: string) =>
    api.get<VoteResultsDto>(`/polls/${pollId}/results`).then((r) => r.data),

  getComments: (pollId: string, page = 1, limit = 20) =>
    api
      .get<CommentListDto>(`/polls/${pollId}/comments`, { params: { page, limit } })
      .then((r) => r.data),

  addComment: (pollId: string, dto: CreateCommentDto) =>
    api.post<CommentDto>(`/polls/${pollId}/comments`, dto).then((r) => r.data),
}
