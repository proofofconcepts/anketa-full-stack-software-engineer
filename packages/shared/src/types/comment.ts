import type { UserDto } from './user';
import type { PaginationMeta } from './poll';

export interface CommentDto {
  id: string;
  content: string;
  author: UserDto;
  createdAt: string;
}

export interface CommentListDto {
  data: CommentDto[];
  meta: PaginationMeta;
}

export interface CreateCommentDto {
  content: string;
}
