import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { lazy } from 'react';
import { RootLayout } from './routes/__root';
import { useAuthStore } from './store/auth.store';

const FeedPage = lazy(() =>
  import('./routes/feed').then((m) => ({ default: m.FeedPage })),
);

const CreatePollPage = lazy(() =>
  import('./routes/polls.new').then((m) => ({ default: m.CreatePollPage })),
);

const LoginPage = lazy(() =>
  import('./routes/login').then((m) => ({ default: m.LoginPage })),
);

const RegisterPage = lazy(() =>
  import('./routes/register').then((m) => ({ default: m.RegisterPage })),
);

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: '/login' });
  },
  component: FeedPage,
});

const createPollRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/polls/new',
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: '/login' });
  },
  component: CreatePollPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) throw redirect({ to: '/' });
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) throw redirect({ to: '/' });
  },
  component: RegisterPage,
});

const routeTree = rootRoute.addChildren([indexRoute, createPollRoute, loginRoute, registerRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
