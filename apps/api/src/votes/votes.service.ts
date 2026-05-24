import { ConflictException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CastVoteDto } from './dto/cast-vote.dto';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async castVote(pollId: string, userId: string, dto: CastVoteDto) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.expiresAt && poll.expiresAt < new Date()) throw new GoneException('Poll has expired');

    const optionBelongsToPoll = poll.options.some((o) => o.id === dto.optionId);
    if (!optionBelongsToPoll) throw new NotFoundException('Option not found on this poll');

    const existingVote = await this.prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId } },
    });
    if (existingVote) throw new ConflictException('Already voted on this poll');

    await this.prisma.vote.create({ data: { userId, pollId, optionId: dto.optionId } });

    return this.getResults(pollId);
  }

  async getResults(pollId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { include: { _count: { select: { votes: true } } } } },
    });
    if (!poll) throw new NotFoundException('Poll not found');

    const totalVotes = poll.options.reduce((sum, o) => sum + o._count.votes, 0);

    return {
      pollId: poll.id,
      totalVotes,
      options: poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        imageUrl: opt.imageUrl,
        votesCount: opt._count.votes,
        percentage:
          totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100 * 10) / 10 : 0,
      })),
    };
  }
}
