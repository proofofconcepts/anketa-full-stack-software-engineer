import '@mantine/core/styles.css';
import { Button, MantineProvider } from '@mantine/core';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { selectIsAuthenticated, useAuthStore } from '../store/auth.store';
import { usePollsStore } from '../store/polls.store';

export function RootLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { logout } = useAuthStore();
  const { error, notice } = usePollsStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    void navigate({ to: '/login' });
  }

  return (
    <MantineProvider>
      <main className="mx-auto max-w-4xl px-4 pt-8 pb-16">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-xs font-bold tracking-widest uppercase text-[#042f2e]">Anketa Web</p>
            <h1 className="mt-1 mb-2 text-[clamp(1.8rem,2.5vw,2.8rem)] font-bold leading-tight">
              Vote Today. Influence Tomorrow.
            </h1>
          </div>
          {isAuthenticated ? (
            <nav className="flex gap-2 mt-2 shrink-0">
              <Link
                to="/"
                className="rounded-full px-4 py-2 text-sm font-semibold border border-slate-200 text-slate-700 no-underline hover:bg-slate-50"
                activeProps={{ className: 'rounded-full px-4 py-2 text-sm font-semibold bg-[#0ea5a4] text-white no-underline border border-[#0ea5a4]' }}
                activeOptions={{ exact: true }}
              >
                Feed
              </Link>
              <Link
                to="/polls/new"
                className="rounded-full px-4 py-2 text-sm font-semibold border border-slate-200 text-slate-700 no-underline hover:bg-slate-50"
                activeProps={{ className: 'rounded-full px-4 py-2 text-sm font-semibold bg-[#0ea5a4] text-white no-underline border border-[#0ea5a4]' }}
              >
                New Poll
              </Link>
              <Button
                variant="subtle"
                size="sm"
                color="gray"
                onClick={handleLogout}
                className="rounded-full"
              >
                Logout
              </Button>
            </nav>
          ) : null}
        </header>

        {error ? (
          <p className="my-3 px-4 py-3 rounded-xl bg-rose-100 text-rose-700">{error}</p>
        ) : null}
        {notice ? (
          <p className="my-3 px-4 py-3 rounded-xl bg-cyan-50 text-cyan-700">{notice}</p>
        ) : null}

        <Suspense fallback={<p className="text-center py-8 text-slate-400">Loading...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </MantineProvider>
  );
}
