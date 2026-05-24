import { AppShell, Burger, Button, Group, NavLink, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
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
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text fw={700} size="lg" component="span">
                Anketa
              </Text>
            </Link>
          </Group>
          <Group>
            {isAuthenticated ? (
              <>
                <Text size="sm">@{user?.username}</Text>
                <Button variant="subtle" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <NavLink component={Link as any} to="/login" label="Login" />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <NavLink component={Link as any} to="/register" label="Register" />
              </>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <NavLink component={Link as any} to="/" label="Trending" />
        {isAuthenticated && (
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <NavLink component={Link as any} to="/following" label="Following" />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <NavLink component={Link as any} to="/polls/create" label="Create Poll" />
            <NavLink
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              component={Link as any}
              to="/profile/$username"
              params={{ username: user?.username ?? '' }}
              label="My Profile"
            />
          </>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
