import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByPoll(pollId: string, page: number, limit: number) {
    const poll = await this.prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) throw new NotFoundException('Poll not found');

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { pollId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            include: { _count: { select: { followers: true, following: true, polls: true } } },
          },
        },
      }),
      this.prisma.comment.count({ where: { pollId } }),
    ]);

    return {
      data: comments.map(this.toDto),
      meta: { total, page, limit, hasNextPage: page * limit < total },
    };
  }

  async create(pollId: string, author: User, dto: CreateCommentDto) {
    const poll = await this.prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) throw new NotFoundException('Poll not found');

    const comment = await this.prisma.comment.create({
      data: { content: dto.content, pollId, userId: author.id },
      include: {
        user: {
          include: { _count: { select: { followers: true, following: true, polls: true } } },
        },
      },
    });
    return this.toDto(comment);
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Not the comment author');
    await this.prisma.comment.delete({ where: { id } });
  }

  private toDto(comment: any) {
    return {
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.user.id,
        email: comment.user.email,
        username: comment.user.username,
        avatar: comment.user.avatar,
        bio: comment.user.bio,
        followersCount: comment.user._count.followers,
        followingCount: comment.user._count.following,
        pollsCount: comment.user._count.polls,
        isFollowing: false,
        createdAt: comment.user.createdAt.toISOString(),
      },
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
