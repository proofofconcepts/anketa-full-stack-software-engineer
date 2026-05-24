import type { OptionDto } from '@anketa/shared'
import { Box, Group, Progress, Text, UnstyledButton } from '@mantine/core'
import { memo } from 'react'

interface Props {
  option: OptionDto
  selected: boolean
  hasVoted: boolean
  onVote: (optionId: string) => void
}

export const OptionBar = memo(function OptionBar({ option, selected, hasVoted, onVote }: Props) {
  return (
    <UnstyledButton
      onClick={() => !hasVoted && onVote(option.id)}
      disabled={hasVoted}
      w="100%"
    >
      <Box
        p="sm"
        className={`rounded-md border transition-colors ${
          selected
            ? 'border-blue-500 bg-blue-50'
            : hasVoted
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
        }`}
      >
        <Group justify="space-between" mb={hasVoted ? 6 : 0}>
          <Text size="sm" fw={selected ? 600 : 400}>
            {option.text}
          </Text>
          {hasVoted && (
            <Text size="sm" fw={600}>
              {option.percentage}%
            </Text>
          )}
        </Group>
        {hasVoted && <Progress value={option.percentage} size="xs" color={selected ? 'blue' : 'gray'} />}
      </Box>
    </UnstyledButton>
  )
})
