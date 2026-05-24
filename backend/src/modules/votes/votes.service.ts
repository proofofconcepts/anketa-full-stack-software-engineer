import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateVoteDto) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: dto.pollId },
      include: { options: true },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const optionExists = poll.options.some((option) => option.id === dto.optionId);
    if (!optionExists) {
      throw new NotFoundException('Option not found for poll');
    }

    try {
      return await this.prisma.vote.create({
        data: {
          userId,
          pollId: dto.pollId,
          optionId: dto.optionId,
        },
      });
    } catch {
      throw new ConflictException('User already voted on this poll');
    }
  }
}
