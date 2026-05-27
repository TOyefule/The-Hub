import { Box, Heading } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  accent?: boolean
}

export function SectionCard({ title, children, accent }: Props) {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      bg="gray.800"
      borderColor={accent ? 'brand.500' : 'gray.700'}
      boxShadow={accent ? '0 0 20px rgba(6,182,212,0.15)' : 'none'}
    >
      <Heading as="h3" size="md" mb={4} color={accent ? 'brand.400' : 'white'}>
        {title}
      </Heading>
      {children}
    </Box>
  )
}
