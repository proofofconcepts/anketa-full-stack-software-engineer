import type { UserDto } from '@anketa/shared'
import { Avatar, Group, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'

interface Props {
  user: UserDto
  size?: 'sm' | 'md' | 'lg'
  withName?: boolean
}

export const UserAvatar = memo(function UserAvatar({ user, size = 'sm', withName = true }: Props) {
  return (
    <Link to="/profile/$username" params={{ username: user.username }}>
      <Group gap="xs">
        <Avatar src={user.avatar} size={size} radius="xl" />
        {withName && (
          <Text size="sm" fw={500} className="hover:underline">
            @{user.username}
          </Text>
        )}
      </Group>
    </Link>
  )
})
