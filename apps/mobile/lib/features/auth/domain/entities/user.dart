import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String username;
  final String? avatar;
  final String? bio;
  final int followersCount;
  final int followingCount;

  const User({
    required this.id,
    required this.email,
    required this.username,
    this.avatar,
    this.bio,
    this.followersCount = 0,
    this.followingCount = 0,
  });

  @override
  List<Object?> get props =>
      [id, email, username, avatar, bio, followersCount, followingCount];
}
