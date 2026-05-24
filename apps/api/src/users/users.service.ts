import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string, requesterId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        _count: { select: { followers: true, following: true, polls: true } },
        followers: requesterId
          ? { where: { followerId: requesterId }, select: { followerId: true } }
          : false,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.toDto(user, requesterId);
  }

  async getMe(user: User) {
    return this.findByUsername(user.username, user.id);
  }

  async updateProfile(user: User, dto: UpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: dto,
      include: {
        _count: { select: { followers: true, following: true, polls: true } },
        followers: { where: { followerId: user.id }, select: { followerId: true } },
      },
    });
    return this.toDto(updated, user.id);
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new ConflictException('Cannot follow yourself');

    const target = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!target) throw new NotFoundException('User not found');

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (existing) throw new ConflictException('Already following');

    await this.prisma.follow.create({ data: { followerId, followingId } });
  }

  async unfollow(followerId: string, followingId: string) {
    const target = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!target) throw new NotFoundException('User not found');

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (!existing) throw new NotFoundException('Not following this user');

    await this.prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
  }

  private toDto(user: any, requesterId?: string) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      pollsCount: user._count.polls,
      isFollowing: requesterId
        ? (user.followers as Array<{ followerId: string }>).some((f) => f.followerId === requesterId)
        : false,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
