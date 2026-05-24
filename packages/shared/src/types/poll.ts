import type { UserDto } from './user';

export interface OptionDto {
  id: string;
  text: string;
  imageUrl: string | null;
  votesCount: number;
  percentage: number;
}

export interface PollDto {
  id: string;
  question: string;
  description: string | null;
  category: string | null;
  expiresAt: string | null;
  totalVotes: number;
  commentsCount: number;
  hasVoted: boolean;
  userVotedOptionId: string | null;
  author: UserDto;
  options: OptionDto[];
  createdAt: string;
}

export interface PollListDto {
  data: PollDto[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface CreatePollOptionDto {
  text: string;
  imageUrl?: string;
}

export interface CreatePollDto {
  question: string;
  description?: string;
  category?: string;
  expiresAt?: string;
  options: CreatePollOptionDto[];
}
