import 'package:anketa/features/profile/domain/entities/profile.dart';

class ProfileModel extends Profile {
  const ProfileModel({
    required super.id,
    required super.username,
    super.avatar,
    super.bio,
    super.followersCount,
    super.followingCount,
    super.isFollowing,
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) => ProfileModel(
        id: json['id'] as String,
        username: json['username'] as String,
        avatar: json['avatar'] as String?,
        bio: json['bio'] as String?,
        followersCount: (json['followersCount'] as int?) ?? 0,
        followingCount: (json['followingCount'] as int?) ?? 0,
        isFollowing: (json['isFollowing'] as bool?) ?? false,
      );
}
