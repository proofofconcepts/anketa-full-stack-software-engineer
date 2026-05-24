import 'package:anketa/features/auth/domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.email,
    required super.username,
    super.avatar,
    super.bio,
    super.followersCount,
    super.followingCount,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['id'] as String,
        email: json['email'] as String,
        username: json['username'] as String,
        avatar: json['avatar'] as String?,
        bio: json['bio'] as String?,
        followersCount: (json['followersCount'] as int?) ?? 0,
        followingCount: (json['followingCount'] as int?) ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'username': username,
        'avatar': avatar,
        'bio': bio,
        'followersCount': followersCount,
        'followingCount': followingCount,
      };
}
