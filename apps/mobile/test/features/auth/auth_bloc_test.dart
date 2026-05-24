import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:anketa/core/error/failures.dart';
import 'package:anketa/features/auth/domain/entities/user.dart';
import 'package:anketa/features/auth/domain/usecases/login_use_case.dart';
import 'package:anketa/features/auth/domain/usecases/register_use_case.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_event.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_state.dart';

class MockLoginUseCase extends Mock implements LoginUseCase {}

class MockRegisterUseCase extends Mock implements RegisterUseCase {}

const _user = User(id: '1', email: 'test@test.com', username: 'testuser');
const _loginResult = LoginResult(
  user: _user,
  accessToken: 'access',
  refreshToken: 'refresh',
);

void main() {
  late MockLoginUseCase mockLogin;
  late MockRegisterUseCase mockRegister;

  setUpAll(() {
    registerFallbackValue(const LoginParams(email: '', password: ''));
    registerFallbackValue(
      const RegisterParams(email: '', username: '', password: ''),
    );
  });

  setUp(() {
    mockLogin = MockLoginUseCase();
    mockRegister = MockRegisterUseCase();
  });

  AuthBloc buildBloc() =>
      AuthBloc(login: mockLogin, register: mockRegister);

  group('AuthBloc', () {
    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, Authenticated] on successful login',
      build: buildBloc,
      setUp: () {
        when(() => mockLogin(any())).thenAnswer((_) async => _loginResult);
      },
      act: (bloc) => bloc.add(const LoginRequested(
        email: 'test@test.com',
        password: 'password',
      )),
      expect: () => [
        const AuthLoading(),
        isA<Authenticated>()
            .having((s) => s.user.username, 'username', 'testuser'),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, AuthError] on login failure',
      build: buildBloc,
      setUp: () {
        when(() => mockLogin(any()))
            .thenThrow(const UnauthorizedFailure());
      },
      act: (bloc) => bloc.add(const LoginRequested(
        email: 'bad@test.com',
        password: 'wrong',
      )),
      expect: () => [
        const AuthLoading(),
        const AuthError('Unauthorized'),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, Authenticated] on successful register',
      build: buildBloc,
      setUp: () {
        when(() => mockRegister(any())).thenAnswer((_) async => _loginResult);
      },
      act: (bloc) => bloc.add(const RegisterRequested(
        email: 'test@test.com',
        username: 'testuser',
        password: 'password',
      )),
      expect: () => [
        const AuthLoading(),
        isA<Authenticated>(),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits Unauthenticated on logout',
      build: buildBloc,
      act: (bloc) => bloc.add(const LogoutRequested()),
      expect: () => [const Unauthenticated()],
    );
  });
}
