import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Link, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth.store';
import { usePollsStore } from '../store/polls.store';

export function RootLayout() {
  const { token, setToken } = useAuthStore();
  const { error, notice } = usePollsStore();

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
        </nav>
      </header>

      <section className="my-5 p-4 rounded-2xl bg-white border border-blue-100">
        <label htmlFor="token" className="block font-semibold mb-2">
          JWT Access Token (required for vote / create)
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste access token from /v1/auth/login"
          className="w-full border border-slate-300 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#0ea5a4]"
        />
      </section>

      {error ? (
        <p className="my-3 px-4 py-3 rounded-xl bg-rose-100 text-rose-700">{error}</p>
      ) : null}
      {notice ? (
        <p className="my-3 px-4 py-3 rounded-xl bg-cyan-50 text-cyan-700">{notice}</p>
      ) : null}

      <Outlet />
    </main>
  </MantineProvider>
  );
}
