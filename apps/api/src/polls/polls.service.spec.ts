import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PollsService } from './polls.service';

const mockAuthor = {
  id: 'user-1',
  email: 'user@example.com',
  username: 'user1',
  passwordHash: '',
  avatar: null,
  bio: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  poll: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  follow: {
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('PollsService', () => {
  let service: PollsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PollsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get(PollsService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('throws NotFoundException when poll does not exist', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when poll does not exist', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue(null);
      await expect(service.remove('bad-id', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is not the author', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue({ id: 'poll-1', authorId: 'other-user' });
      await expect(service.remove('poll-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('deletes poll when user is the author', async () => {
      mockPrisma.poll.findUnique.mockResolvedValue({ id: 'poll-1', authorId: 'user-1' });
      mockPrisma.poll.delete.mockResolvedValue({});
      await service.remove('poll-1', 'user-1');
      expect(mockPrisma.poll.delete).toHaveBeenCalledWith({ where: { id: 'poll-1' } });
    });
  });
});
