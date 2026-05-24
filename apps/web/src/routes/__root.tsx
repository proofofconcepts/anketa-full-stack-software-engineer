import { AppShell, Burger, Group, NavLink, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const [opened, { toggle }] = useDisclosure()
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Link to="/">
              <Text fw={700} size="lg">
                Anketa
              </Text>
            </Link>
          </Group>
          <Group>
            {isAuthenticated ? (
              <>
                <Text size="sm">@{user?.username}</Text>
                <NavLink label="Logout" onClick={logout} />
              </>
            ) : (
              <>
                <Link to="/login">
                  <NavLink label="Login" />
                </Link>
                <Link to="/register">
                  <NavLink label="Register" />
                </Link>
              </>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Link to="/">
          <NavLink label="Trending" />
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/following">
              <NavLink label="Following" />
            </Link>
            <Link to="/polls/create">
              <NavLink label="Create Poll" />
            </Link>
            <Link to="/profile/$username" params={{ username: user?.username ?? '' }}>
              <NavLink label="My Profile" />
            </Link>
          </>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
