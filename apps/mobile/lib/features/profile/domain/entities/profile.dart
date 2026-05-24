import 'package:equatable/equatable.dart';

class Profile extends Equatable {
  final String id;
  final String username;
  final String? avatar;
  final String? bio;
  final int followersCount;
  final int followingCount;
  final bool isFollowing;

  const Profile({
    required this.id,
    required this.username,
    this.avatar,
    this.bio,
    this.followersCount = 0,
    this.followingCount = 0,
    this.isFollowing = false,
  });

  @override
  List<Object?> get props => [
        id,
        username,
        avatar,
        bio,
        followersCount,
        followingCount,
        isFollowing,
      ];
}
