import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PollsService } from '../../src/modules/polls/polls.service';

describe('PollsService', () => {
  let service: PollsService;
  let prisma: {
    poll: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      poll: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PollsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates a poll with options and returns the result', async () => {
      const created = {
        id: 'poll-1',
        question: 'Tabs or spaces?',
        options: [
          { id: 'opt-1', label: 'Tabs' },
          { id: 'opt-2', label: 'Spaces' },
        ],
      };
      prisma.poll.create.mockResolvedValue(created);

      const result = await service.create('user-1', {
        question: 'Tabs or spaces?',
        options: ['Tabs', 'Spaces'],
      });

      expect(result).toEqual(created);
      expect(prisma.poll.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            question: 'Tabs or spaces?',
            createdById: 'user-1',
          }),
        }),
      );
    });
  });

  // ─── list ──────────────────────────────────────────────────────────────────

  describe('list', () => {
    it('returns polls ordered by createdAt descending limited to 50', async () => {
      const polls = [
        { id: 'poll-1', question: 'Q?', options: [], _count: { votes: 2 } },
      ];
      prisma.poll.findMany.mockResolvedValue(polls);

      const result = await service.list();

      expect(result).toEqual(polls);
      expect(prisma.poll.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' }, take: 50 }),
      );
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the poll and returns { deleted: true } when the owner requests it', async () => {
      prisma.poll.findUnique.mockResolvedValue({ id: 'poll-1', createdById: 'user-1' });
      prisma.poll.delete.mockResolvedValue({});

      const result = await service.remove('user-1', 'poll-1');

      expect(result).toEqual({ deleted: true });
      expect(prisma.poll.delete).toHaveBeenCalledWith({ where: { id: 'poll-1' } });
    });

    it('throws NotFoundException when the poll does not exist', async () => {
      prisma.poll.findUnique.mockResolvedValue(null);

      await expect(service.remove('user-1', 'poll-999')).rejects.toThrow(NotFoundException);
      expect(prisma.poll.delete).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when the requester is not the poll owner', async () => {
      prisma.poll.findUnique.mockResolvedValue({ id: 'poll-1', createdById: 'other-user' });

      await expect(service.remove('user-1', 'poll-1')).rejects.toThrow(ForbiddenException);
      expect(prisma.poll.delete).not.toHaveBeenCalled();
    });
  });
});
