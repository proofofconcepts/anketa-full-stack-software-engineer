import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { VotesService } from '../../src/modules/votes/votes.service';

describe('VotesService', () => {
  let service: VotesService;
  let prisma: {
    poll: { findUnique: jest.Mock };
    vote: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      poll: { findUnique: jest.fn() },
      vote: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [VotesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  afterEach(() => jest.clearAllMocks());

  const dto = { pollId: 'poll-1', optionId: 'opt-1' };
  const poll = { id: 'poll-1', options: [{ id: 'opt-1', label: 'React' }] };

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates and returns a vote when poll and option are valid', async () => {
      const vote = { id: 'vote-1', userId: 'user-1', pollId: 'poll-1', optionId: 'opt-1' };
      prisma.poll.findUnique.mockResolvedValue(poll);
      prisma.vote.create.mockResolvedValue(vote);

      const result = await service.create('user-1', dto);

      expect(result).toEqual(vote);
      expect(prisma.vote.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { userId: 'user-1', pollId: 'poll-1', optionId: 'opt-1' },
        }),
      );
    });

    it('throws NotFoundException when the poll does not exist', async () => {
      prisma.poll.findUnique.mockResolvedValue(null);

      await expect(service.create('user-1', dto)).rejects.toThrow(NotFoundException);
      expect(prisma.vote.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the option does not belong to the poll', async () => {
      prisma.poll.findUnique.mockResolvedValue({
        id: 'poll-1',
        options: [{ id: 'opt-99', label: 'Vue' }],
      });

      await expect(service.create('user-1', dto)).rejects.toThrow(NotFoundException);
      expect(prisma.vote.create).not.toHaveBeenCalled();
    });

    it('throws ConflictException when the user has already voted on the poll', async () => {
      prisma.poll.findUnique.mockResolvedValue(poll);
      prisma.vote.create.mockRejectedValue(
        Object.assign(new Error('Unique constraint failed'), { code: 'P2002' }),
      );

      await expect(service.create('user-1', dto)).rejects.toThrow(ConflictException);
    });
  });
});
