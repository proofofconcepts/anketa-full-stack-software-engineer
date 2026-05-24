import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  passwordHash: '',
  avatar: null,
  bio: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  refreshToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockJwt = { sign: jest.fn().mockReturnValue('signed-token') };
const mockConfig = { getOrThrow: jest.fn().mockReturnValue('secret'), get: jest.fn().mockReturnValue('15m') };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('throws ConflictException if email or username taken', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      await expect(
        service.register({ email: 'test@example.com', username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user and returns tokens when credentials are unique', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.register({
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException for unknown email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'pass' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correct-pass', 12);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: hash });
      await expect(service.login({ email: 'test@example.com', password: 'wrong-pass' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns tokens for valid credentials', async () => {
      const hash = await bcrypt.hash('correct-pass', 12);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: hash });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ email: 'test@example.com', password: 'correct-pass' });
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('refresh', () => {
    it('throws UnauthorizedException for invalid token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);
      await expect(service.refresh('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for expired token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        token: 'tok',
        user: mockUser,
        expiresAt: new Date(Date.now() - 1000),
      });
      await expect(service.refresh('tok')).rejects.toThrow(UnauthorizedException);
    });
  });
});
