export interface UserDto {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  pollsCount: number;
  isFollowing: boolean;
  createdAt: string;
}

export interface UpdateProfileDto {
  bio?: string;
  avatar?: string;
}
