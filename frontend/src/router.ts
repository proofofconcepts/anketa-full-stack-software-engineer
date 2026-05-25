import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { lazy } from 'react';
import { RootLayout } from './routes/__root';

const FeedPage = lazy(() =>
  import('./routes/feed').then((m) => ({ default: m.FeedPage })),
);

const CreatePollPage = lazy(() =>
  import('./routes/polls.new').then((m) => ({ default: m.CreatePollPage })),
);

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FeedPage,
});

const createPollRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/polls/new',
  component: CreatePollPage,
});

const routeTree = rootRoute.addChildren([indexRoute, createPollRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
