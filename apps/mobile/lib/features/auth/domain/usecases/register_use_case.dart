import 'package:equatable/equatable.dart';
import 'package:anketa/features/auth/domain/repositories/auth_repository.dart';
import 'package:anketa/features/auth/domain/usecases/login_use_case.dart';

class RegisterParams extends Equatable {
  final String email;
  final String username;
  final String password;
  const RegisterParams({
    required this.email,
    required this.username,
    required this.password,
  });

  @override
  List<Object> get props => [email, username, password];
}

class RegisterUseCase {
  final AuthRepository _repository;
  const RegisterUseCase(this._repository);

  Future<LoginResult> call(RegisterParams params) async {
    final result = await _repository.register(
      email: params.email,
      username: params.username,
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
