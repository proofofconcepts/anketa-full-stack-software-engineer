import 'package:anketa/core/error/failures.dart';
import 'package:anketa/features/auth/domain/entities/user.dart';

abstract class AuthRepository {
  Future<({User user, String accessToken, String refreshToken})> login({
    required String email,
    required String password,
  });

  Future<({User user, String accessToken, String refreshToken})> register({
    required String email,
    required String username,
    required String password,
  });

  Future<void> logout(String refreshToken);

  Future<User?> getCurrentUser();

  Future<void> saveTokens(String accessToken, String refreshToken);

  Future<void> clearTokens();
}

typedef AuthResult = ({
  User user,
  String accessToken,
  String refreshToken,
  Failure? failure
});
