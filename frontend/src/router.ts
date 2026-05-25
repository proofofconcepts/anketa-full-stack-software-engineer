import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { RootLayout } from './routes/__root';
import { FeedPage } from './routes/feed';
import { CreatePollPage } from './routes/polls.new';

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
