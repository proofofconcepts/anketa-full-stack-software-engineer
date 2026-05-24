import { ConflictException, GoneException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { VotesService } from './votes.service';

const mockPoll = {
  id: 'poll-1',
  question: 'Favorite color?',
  expiresAt: null,
  options: [
    { id: 'opt-1', text: 'Red', imageUrl: null },
    { id: 'opt-2', text: 'Blue', imageUrl: null },
  ],
};

const mockPrisma = {
  poll: {
    findUnique: jest.fn(),
  },
  vote: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('VotesService', () => {
  let service: VotesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VotesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get(VotesService);
    jest.clearAllMocks();
  });

  describe('castVote', () => {
    it('throws NotFoundException when poll does not exist', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue(null);
      await expect(service.castVote('bad-id', 'user-1', { optionId: 'opt-1' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws GoneException when poll has expired', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue({
        ...mockPoll,
        expiresAt: new Date(Date.now() - 1000),
      });
      await expect(service.castVote('poll-1', 'user-1', { optionId: 'opt-1' })).rejects.toThrow(
        GoneException,
      );
    });

    it('throws NotFoundException for option not on this poll', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue(mockPoll);
      await expect(service.castVote('poll-1', 'user-1', { optionId: 'other-opt' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ConflictException when user already voted', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue(mockPoll);
      mockPrisma.vote.findUnique.mockResolvedValue({ id: 'existing-vote' });
      await expect(service.castVote('poll-1', 'user-1', { optionId: 'opt-1' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates vote and returns results on success', async () => {
      mockPrisma.poll.findUnique
        .mockResolvedValueOnce(mockPoll)
        .mockResolvedValueOnce({
          ...mockPoll,
          options: [
            { id: 'opt-1', text: 'Red', imageUrl: null, _count: { votes: 1 } },
            { id: 'opt-2', text: 'Blue', imageUrl: null, _count: { votes: 0 } },
          ],
        });
      mockPrisma.vote.findUnique.mockResolvedValue(null);
      mockPrisma.vote.create.mockResolvedValue({});

      const result = await service.castVote('poll-1', 'user-1', { optionId: 'opt-1' });
      expect(result.totalVotes).toBe(1);
      expect(result.options[0].percentage).toBe(100);
    });
  });
});
