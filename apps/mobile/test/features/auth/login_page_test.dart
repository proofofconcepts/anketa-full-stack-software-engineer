import 'package:bloc_test/bloc_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_event.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_state.dart';
import 'package:anketa/features/auth/presentation/pages/login_page.dart';

class MockAuthBloc extends MockBloc<AuthEvent, AuthState> implements AuthBloc {}

Widget _buildSubject(AuthBloc bloc) => MaterialApp(
      home: BlocProvider<AuthBloc>.value(
        value: bloc,
        child: const LoginPage(),
      ),
    );

void main() {
  late MockAuthBloc mockBloc;

  setUp(() {
    mockBloc = MockAuthBloc();
    when(() => mockBloc.state).thenReturn(const AuthInitial());
  });

  tearDown(() => mockBloc.close());

  group('LoginPage', () {
    testWidgets('renders email and password fields', (tester) async {
      await tester.pumpWidget(_buildSubject(mockBloc));
      expect(find.byKey(const Key('emailField')), findsOneWidget);
      expect(find.byKey(const Key('passwordField')), findsOneWidget);
      expect(find.byKey(const Key('loginButton')), findsOneWidget);
    });

    testWidgets('shows validation error when email is empty', (tester) async {
      await tester.pumpWidget(_buildSubject(mockBloc));
      await tester.tap(find.byKey(const Key('loginButton')));
      await tester.pump();
      expect(find.text('Enter a valid email'), findsOneWidget);
    });

    testWidgets('dispatches LoginRequested with valid credentials',
        (tester) async {
      await tester.pumpWidget(_buildSubject(mockBloc));

      await tester.enterText(
          find.byKey(const Key('emailField')), 'test@test.com');
      await tester.enterText(
          find.byKey(const Key('passwordField')), 'password123');
      await tester.tap(find.byKey(const Key('loginButton')));
      await tester.pump();

      verify(() => mockBloc.add(const LoginRequested(
            email: 'test@test.com',
            password: 'password123',
          ))).called(1);
    });

    testWidgets('shows loading indicator when AuthLoading', (tester) async {
      when(() => mockBloc.state).thenReturn(const AuthLoading());
      await tester.pumpWidget(_buildSubject(mockBloc));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });
}
