import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthService } from '../../src/modules/auth/auth.service';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const CONFIG_VALUES: Record<string, string> = {
  JWT_ACCESS_SECRET: 'test-access-secret',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  JWT_ACCESS_TTL: '15m',
  JWT_REFRESH_TTL: '7d',
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; create: jest.Mock };
    refreshToken: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
  };
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock };
  let config: { getOrThrow: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn(), create: jest.fn() },
      refreshToken: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    };
    jwtService = { signAsync: jest.fn(), verifyAsync: jest.fn() };
    config = { getOrThrow: jest.fn((key: string) => CONFIG_VALUES[key]) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── helpers ───────────────────────────────────────────────────────────────

  function stubIssueTokens() {
    jwtService.signAsync.mockResolvedValue('mock-token');
    prisma.refreshToken.create.mockResolvedValue({});
  }

  // ─── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('creates a user and returns tokens when email is not taken', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcryptjs.hash as jest.Mock).mockResolvedValue('hashed-pw');
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        displayName: 'Alice',
      });
      stubIssueTokens();

      const result = await service.register({
        email: 'a@b.com',
        password: 'secret',
        displayName: 'Alice',
      });

      expect(result).toHaveProperty('accessToken', 'mock-token');
      expect(result).toHaveProperty('refreshToken', 'mock-token');
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: 'a@b.com', displayName: 'Alice' }),
        }),
      );
    });

    it('throws ConflictException when email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'a@b.com' });

      await expect(
        service.register({ email: 'a@b.com', password: 'secret', displayName: 'Alice' }),
      ).rejects.toThrow(ConflictException);

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns tokens for valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        passwordHash: 'hash',
      });
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
      stubIssueTokens();

      const result = await service.login({ email: 'a@b.com', password: 'secret' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'unknown@b.com', password: 'x' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException for wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        passwordHash: 'hash',
      });
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── refresh ───────────────────────────────────────────────────────────────

  describe('refresh', () => {
    const futureDate = new Date(Date.now() + 100_000);
    const user = { id: 'user-1', email: 'a@b.com' };

    it('revokes the old token and issues new tokens', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        user,
        revokedAt: null,
        expiresAt: futureDate,
      });
      prisma.refreshToken.update.mockResolvedValue({});
      stubIssueTokens();

      const result = await service.refresh('valid-refresh-token');

      expect(result).toHaveProperty('accessToken');
      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        }),
      );
    });

    it('throws UnauthorizedException when token record does not exist', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.refresh('unknown-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when token has been revoked', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        user,
        revokedAt: new Date(),
        expiresAt: futureDate,
      });

      await expect(service.refresh('revoked-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when token has expired', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        user,
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1),
      });

      await expect(service.refresh('expired-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── verifyAccessToken ─────────────────────────────────────────────────────

  describe('verifyAccessToken', () => {
    it('returns the decoded payload for a valid token', async () => {
      const payload = { sub: 'user-1', email: 'a@b.com' };
      jwtService.verifyAsync.mockResolvedValue(payload);

      const result = await service.verifyAccessToken('valid-token');

      expect(result).toEqual(payload);
    });

    it('throws UnauthorizedException for an invalid token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt malformed'));

      await expect(service.verifyAccessToken('bad-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
