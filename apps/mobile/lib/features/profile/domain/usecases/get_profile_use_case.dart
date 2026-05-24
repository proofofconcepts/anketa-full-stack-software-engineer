import 'package:anketa/features/profile/domain/entities/profile.dart';
import 'package:anketa/features/profile/domain/repositories/profile_repository.dart';

class GetProfileUseCase {
  final ProfileRepository _repository;
  const GetProfileUseCase(this._repository);

  Future<Profile> call(String username) => _repository.getProfile(username);
}
