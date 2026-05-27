import { Badge } from '@chakra-ui/react'

const colors: Record<string, string> = {
  low: 'green',
  medium: 'yellow',
  high: 'orange',
  critical: 'red',
  warning: 'orange',
  info: 'blue',
}

export function RiskBadge({ level }: { level: string }) {
  const scheme = colors[level?.toLowerCase()] ?? 'gray'
  return (
    <Badge colorScheme={scheme} px={2} py={1} borderRadius="md" fontSize="xs" textTransform="uppercase">
      {level}
    </Badge>
  )
}
