import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePollDto } from './dto/create-poll.dto';

interface ListPollsOptions {
  page: number;
  limit: number;
  category?: string;
  requesterId: string | null;
}

@Injectable()
export class PollsService {
  constructor(private prisma: PrismaService) {}

  async create(author: User, dto: CreatePollDto) {
    const poll = await this.prisma.poll.create({
      data: {
        question: dto.question,
        description: dto.description,
        category: dto.category,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        authorId: author.id,
        options: { create: dto.options },
      },
      include: this.pollInclude(author.id),
    });
    return this.toDto(poll, author.id);
  }

  async findTrending({ page, limit, category, requesterId }: ListPollsOptions) {
    const where = category ? { category } : {};
    const [polls, total] = await Promise.all([
      this.prisma.poll.findMany({
        where,
        orderBy: { votes: { _count: 'desc' } },
        skip: (page - 1) * limit,
        take: limit,
        include: this.pollInclude(requesterId),
      }),
      this.prisma.poll.count({ where }),
    ]);
    return this.toListDto(polls, total, page, limit, requesterId);
  }

  async findFollowing({ page, limit, requesterId }: ListPollsOptions) {
    if (!requesterId) return this.toListDto([], 0, page, limit, null);
    const following = await this.prisma.follow.findMany({
      where: { followerId: requesterId },
      select: { followingId: true },
    });
    const authorIds = following.map((f) => f.followingId);

    const where = { authorId: { in: authorIds } };
    const [polls, total] = await Promise.all([
      this.prisma.poll.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: this.pollInclude(requesterId),
      }),
      this.prisma.poll.count({ where }),
    ]);
    return this.toListDto(polls, total, page, limit, requesterId);
  }

  async findOne(id: string, requesterId: string | null) {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
      include: this.pollInclude(requesterId),
    });
    if (!poll) throw new NotFoundException('Poll not found');
    return this.toDto(poll, requesterId);
  }

  async remove(id: string, userId: string) {
    const poll = await this.prisma.poll.findUnique({ where: { id } });
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.authorId !== userId) throw new ForbiddenException('Not the poll author');
    await this.prisma.poll.delete({ where: { id } });
  }

  async findByUsername(username: string, page: number, limit: number, requesterId: string | null) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    const where = { authorId: user.id };
    const [polls, total] = await Promise.all([
      this.prisma.poll.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: this.pollInclude(requesterId),
      }),
      this.prisma.poll.count({ where }),
    ]);
    return this.toListDto(polls, total, page, limit, requesterId);
  }

  private pollInclude(requesterId: string | null) {
    return {
      author: {
        include: {
          _count: { select: { followers: true, following: true, polls: true } },
          followers: requesterId != null
            ? { where: { followerId: requesterId }, select: { followerId: true } }
            : { take: 0, select: { followerId: true } },
        },
      },
      options: {
        include: { _count: { select: { votes: true } } },
      },
      votes: requesterId != null
        ? { where: { userId: requesterId }, select: { optionId: true } }
        : { take: 0, select: { optionId: true } },
      _count: { select: { votes: true, comments: true } },
    };
  }

  private toDto(poll: any, requesterId: string | null) {
    const totalVotes = poll._count.votes;
    const userVote = poll.votes[0] ?? null;

    return {
      id: poll.id,
      question: poll.question,
      description: poll.description,
      category: poll.category,
      expiresAt: poll.expiresAt?.toISOString() ?? null,
      totalVotes,
      commentsCount: poll._count.comments,
      hasVoted: !!userVote,
      userVotedOptionId: userVote?.optionId ?? null,
      author: {
        id: poll.author.id,
        email: poll.author.email,
        username: poll.author.username,
        avatar: poll.author.avatar,
        bio: poll.author.bio,
        followersCount: poll.author._count.followers,
        followingCount: poll.author._count.following,
        pollsCount: poll.author._count.polls,
        isFollowing: poll.author.followers.some((f: any) => f.followerId === requesterId),
        createdAt: poll.author.createdAt.toISOString(),
      },
      options: poll.options.map((opt: any) => {
        const votesCount = opt._count.votes;
        return {
          id: opt.id,
          text: opt.text,
          imageUrl: opt.imageUrl,
          votesCount,
          percentage: totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100 * 10) / 10 : 0,
        };
      }),
      createdAt: poll.createdAt.toISOString(),
    };
  }

  private toListDto(polls: any[], total: number, page: number, limit: number, requesterId: string | null) {
    return {
      data: polls.map((p) => this.toDto(p, requesterId)),
      meta: {
        total,
        page,
        limit,
        hasNextPage: page * limit < total,
      },
    };
  }
}
