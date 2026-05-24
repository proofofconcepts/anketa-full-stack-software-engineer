import 'package:equatable/equatable.dart';
import 'package:anketa/features/auth/domain/entities/user.dart';
import 'package:anketa/features/auth/domain/repositories/auth_repository.dart';

class LoginParams extends Equatable {
  final String email;
  final String password;
  const LoginParams({required this.email, required this.password});

  @override
  List<Object> get props => [email, password];
}

class LoginResult extends Equatable {
  final User user;
  final String accessToken;
  final String refreshToken;
  const LoginResult({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
  });

  @override
  List<Object> get props => [user, accessToken, refreshToken];
}

class LoginUseCase {
  final AuthRepository _repository;
  const LoginUseCase(this._repository);

  Future<LoginResult> call(LoginParams params) async {
    final result = await _repository.login(
      email: params.email,
      password: params.password,
    );
    await _repository.saveTokens(result.accessToken, result.refreshToken);
    return LoginResult(
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    );
  }
}
