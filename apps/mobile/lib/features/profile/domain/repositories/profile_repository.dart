import 'package:anketa/features/profile/domain/entities/profile.dart';

abstract class ProfileRepository {
  Future<Profile> getProfile(String username);
  Future<void> follow(String userId);
  Future<void> unfollow(String userId);
}
