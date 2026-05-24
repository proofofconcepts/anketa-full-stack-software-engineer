import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:anketa/core/error/failures.dart';
import 'package:anketa/features/auth/domain/usecases/login_use_case.dart';
import 'package:anketa/features/auth/domain/usecases/register_use_case.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase login;
  final RegisterUseCase register;

  AuthBloc({required this.login, required this.register})
      : super(const AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      final result = await login(
        LoginParams(email: event.email, password: event.password),
      );
      emit(Authenticated(
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      ));
    } on Failure catch (f) {
      emit(AuthError(f.message));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      final result = await register(
        RegisterParams(
          email: event.email,
          username: event.username,
          password: event.password,
        ),
      );
      emit(Authenticated(
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      ));
    } on Failure catch (f) {
      emit(AuthError(f.message));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const Unauthenticated());
  }
}
