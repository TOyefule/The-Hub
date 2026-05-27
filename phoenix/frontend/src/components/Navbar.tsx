import { Box, Flex, Heading, HStack, Link, Badge } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import type { HealthStatus } from '../types'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/intake', label: 'Intake' },
  { to: '/audit', label: 'Audit' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/refactor', label: 'Refactor' },
  { to: '/security', label: 'Security' },
  { to: '/migration', label: 'Migration Plan' },
]

interface Props {
  health?: HealthStatus
}

export function Navbar({ health }: Props) {
  return (
    <Box bg="gray.900" borderBottomWidth="1px" borderColor="gray.700" px={6} py={3} position="sticky" top={0} zIndex={10}>
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        <HStack spacing={3}>
          <Heading size="md" color="brand.400" letterSpacing="tight">
            ⚙️ Phoenix
          </Heading>
          {health && (
            <Badge colorScheme={health.mode === 'live' ? 'green' : 'yellow'} fontSize="xs">
              {health.mode === 'live' ? 'AI Live' : 'Demo Mode'}
            </Badge>
          )}
        </HStack>
        <HStack spacing={1} flexWrap="wrap">
          {navItems.map((item) => (
            <Link
              as={NavLink}
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm"
              color="gray.300"
              _hover={{ color: 'brand.400', bg: 'gray.800' }}
              _activeLink={{ color: 'brand.400', bg: 'gray.800', fontWeight: 'semibold' }}
            >
              {item.label}
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  )
}
