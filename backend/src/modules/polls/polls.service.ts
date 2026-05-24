import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreatePollDto) {
    return this.prisma.poll.create({
      data: {
        question: dto.question,
        createdById: userId,
        options: {
          createMany: {
            data: dto.options.map((label) => ({ label })),
          },
        },
      },
      include: { options: true },
    });
  }

  list() {
    return this.prisma.poll.findMany({
      include: {
        options: true,
        _count: { select: { votes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async remove(userId: string, pollId: string) {
    const poll = await this.prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.createdById !== userId) {
      throw new ForbiddenException('Only the poll owner can delete this poll');
    }

    await this.prisma.poll.delete({ where: { id: pollId } });
    return { deleted: true };
  }
}
