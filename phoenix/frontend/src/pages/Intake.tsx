import { useState } from 'react'
import {
  Box, Button, Input, VStack, Text, HStack, SimpleGrid, Spinner,
  Alert, AlertIcon, Tag, Wrap, WrapItem,
} from '@chakra-ui/react'
import { SectionCard } from '../components/SectionCard'
import { RiskBadge } from '../components/RiskBadge'
import type { ScanResult } from '../types'
import { api } from '../api'

export function Intake() {
  const [repoUrl, setRepoUrl] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScan = async () => {
    if (!repoUrl.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.intake(repoUrl.trim())
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Scan failed')
    }
    setLoading(false)
  }

  return (
    <Box maxW="900px" mx="auto" px={6} py={8}>
      <VStack spacing={6} align="stretch">
        <SectionCard title="Repository Intake" accent>
          <VStack spacing={4} align="stretch">
            <Text color="gray.400" fontSize="sm">
              Enter a GitHub, GitLab, or Bitbucket repository URL to begin architecture analysis.
            </Text>
            <HStack>
              <Input
                placeholder="https://github.com/org/legacy-app"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                bg="gray.900"
                borderColor="gray.600"
                _focus={{ borderColor: 'brand.400' }}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <Button
                colorScheme="cyan"
                onClick={handleScan}
                isLoading={loading}
                loadingText="Scanning"
                minW="140px"
              >
                Analyze
              </Button>
            </HStack>
            <Text fontSize="xs" color="gray.600">
              Demo mode: any URL returns a realistic AngularJS + Spring MVC scan result.
              Configure <code>GEMINI_API_KEY</code> in the backend for live AI analysis.
            </Text>
          </VStack>
        </SectionCard>

        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {loading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="brand.400" />
            <Text mt={4} color="gray.400">Scanning repository architecture...</Text>
          </Box>
        )}

        {result && (
          <VStack spacing={4} align="stretch">
            <SectionCard title="System Profile">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {[
                  { label: 'Frontend', value: result.frontend },
                  { label: 'Backend', value: result.backend },
                  { label: 'Database', value: result.database },
                ].map(({ label, value }) => (
                  <Box key={label} p={4} bg="gray.900" borderRadius="lg">
                    <Text fontSize="xs" color="gray.500" mb={1}>{label}</Text>
                    <Text fontWeight="semibold" color="white">{value}</Text>
                  </Box>
                ))}
                <Box p={4} bg="gray.900" borderRadius="lg">
                  <Text fontSize="xs" color="gray.500" mb={1}>Risk Profile</Text>
                  <RiskBadge level={result.risk} />
                </Box>
              </SimpleGrid>
            </SectionCard>

            <SectionCard title="Detected Technologies">
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={2}>Languages</Text>
                  <Wrap>
                    {result.languages.map((l) => (
                      <WrapItem key={l}>
                        <Tag colorScheme="blue" size="sm">{l}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={2}>Frameworks</Text>
                  <Wrap>
                    {result.frameworks.map((f) => (
                      <WrapItem key={f}>
                        <Tag colorScheme="purple" size="sm">{f}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              </VStack>
            </SectionCard>

            <SectionCard title="AI Summary">
              <Text color="gray.300" lineHeight="tall">{result.summary}</Text>
            </SectionCard>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}
