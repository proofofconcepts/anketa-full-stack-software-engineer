import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:anketa/features/auth/presentation/bloc/auth_state.dart';
import 'package:anketa/features/auth/presentation/pages/login_page.dart';
import 'package:anketa/features/auth/presentation/pages/register_page.dart';
import 'package:anketa/features/polls/presentation/pages/home_page.dart';
import 'package:anketa/features/polls/presentation/pages/poll_detail_page.dart';
import 'package:anketa/features/profile/presentation/pages/profile_page.dart';
import 'package:anketa/core/di/service_locator.dart';
import 'package:anketa/features/polls/presentation/bloc/poll_list_bloc.dart';

GoRouter buildRouter(AuthBloc authBloc) => GoRouter(
      initialLocation: '/',
      redirect: (context, state) {
        final authState = authBloc.state;
        final isAuth = authState is Authenticated;
        final goingToAuth = state.matchedLocation == '/login' ||
            state.matchedLocation == '/register';

        if (!isAuth && !goingToAuth) return '/login';
        if (isAuth && goingToAuth) return '/';
        return null;
      },
      refreshListenable: _BlocListenable(authBloc),
      routes: [
        ShellRoute(
          builder: (context, state, child) => _AppShell(child: child),
          routes: [
            GoRoute(
              path: '/',
              builder: (context, state) => BlocProvider(
                create: (_) => sl<PollListBloc>(),
                child: const HomePage(),
              ),
            ),
            GoRoute(
              path: '/polls/:pollId',
              builder: (context, state) {
                final extra = state.extra;
                if (extra == null) {
                  return const Scaffold(
                    body: Center(child: CircularProgressIndicator()),
                  );
                }
                return PollDetailPage(
                  pollId: state.pathParameters['pollId']!,
                  poll: extra as dynamic,
                );
              },
            ),
            GoRoute(
              path: '/profile/:username',
              builder: (context, state) => ProfilePage(
                username: state.pathParameters['username']!,
              ),
            ),
          ],
        ),
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginPage(),
        ),
        GoRoute(
          path: '/register',
          builder: (context, state) => const RegisterPage(),
        ),
      ],
    );

class _BlocListenable extends ChangeNotifier {
  _BlocListenable(AuthBloc bloc) {
    bloc.stream.listen((_) => notifyListeners());
  }
}

class _AppShell extends StatefulWidget {
  final Widget child;
  const _AppShell({required this.child});

  @override
  State<_AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<_AppShell> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (i) {
          setState(() => _selectedIndex = i);
          switch (i) {
            case 0:
              context.go('/');
            case 1:
              final authState = context.read<AuthBloc>().state;
              if (authState is Authenticated) {
                context.go('/profile/${authState.user.username}');
              } else {
                context.go('/login');
              }
          }
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
