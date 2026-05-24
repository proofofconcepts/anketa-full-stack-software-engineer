import 'package:anketa/features/profile/domain/entities/profile.dart';
import 'package:anketa/features/profile/domain/repositories/profile_repository.dart';
import '../datasources/profile_remote_data_source.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource _dataSource;
  const ProfileRepositoryImpl(this._dataSource);

  @override
  Future<Profile> getProfile(String username) =>
      _dataSource.getProfile(username);

  @override
  Future<void> follow(String userId) => _dataSource.follow(userId);

  @override
  Future<void> unfollow(String userId) => _dataSource.unfollow(userId);
}
