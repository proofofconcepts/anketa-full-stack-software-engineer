import 'package:shared_preferences/shared_preferences.dart';
import 'package:anketa/features/auth/domain/entities/user.dart';
import 'package:anketa/features/auth/domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final SharedPreferences _prefs;

  const AuthRepositoryImpl(this._remoteDataSource, this._prefs);

  @override
  Future<({User user, String accessToken, String refreshToken})> login({
    required String email,
    required String password,
  }) =>
      _remoteDataSource.login(email: email, password: password);

  @override
  Future<({User user, String accessToken, String refreshToken})> register({
    required String email,
    required String username,
    required String password,
  }) =>
      _remoteDataSource.register(
          email: email, username: username, password: password);

  @override
  Future<void> logout(String refreshToken) =>
      _remoteDataSource.logout(refreshToken);

  @override
  Future<User?> getCurrentUser() async {
    final id = _prefs.getString('userId');
    final email = _prefs.getString('userEmail');
    final username = _prefs.getString('userUsername');
    if (id == null || email == null || username == null) return null;
    return UserModel(id: id, email: email, username: username);
  }

  @override
  Future<void> saveTokens(String accessToken, String refreshToken) async {
    await _prefs.setString('accessToken', accessToken);
    await _prefs.setString('refreshToken', refreshToken);
  }

  @override
  Future<void> clearTokens() async {
    await _prefs.remove('accessToken');
    await _prefs.remove('refreshToken');
    await _prefs.remove('userId');
    await _prefs.remove('userEmail');
    await _prefs.remove('userUsername');
  }
}
