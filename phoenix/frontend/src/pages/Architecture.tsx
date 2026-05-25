import { useState } from 'react'
import {
  Box, Button, VStack, Text, HStack, Input, Spinner, Alert, AlertIcon, SimpleGrid,
} from '@chakra-ui/react'
import { SectionCard } from '../components/SectionCard'
import { MermaidDiagram } from '../components/MermaidDiagram'
import type { ArchitectureDiagram } from '../types'
import { api } from '../api'

export function Architecture() {
  const [form, setForm] = useState({ frontend: 'AngularJS', backend: 'Java Spring MVC', database: 'Oracle' })
  const [diagram, setDiagram] = useState<ArchitectureDiagram | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.architectureMap(form.frontend, form.backend, form.database)
      setDiagram(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate diagram')
    }
    setLoading(false)
  }

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>
      <VStack spacing={6} align="stretch">
        <SectionCard title="Architecture Mapping Engine" accent>
          <VStack spacing={4} align="stretch">
            <Text color="gray.400" fontSize="sm">
              Describe your legacy stack to generate a Mermaid architecture diagram.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {(['frontend', 'backend', 'database'] as const).map((field) => (
                <Box key={field}>
                  <Text fontSize="xs" color="gray.500" mb={1} textTransform="capitalize">{field}</Text>
                  <Input
                    value={form[field]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    bg="gray.900" borderColor="gray.600" _focus={{ borderColor: 'brand.400' }}
                    size="sm"
                  />
                </Box>
              ))}
            </SimpleGrid>
            <Button colorScheme="cyan" onClick={handleGenerate} isLoading={loading} loadingText="Generating" alignSelf="flex-start">
              Generate Diagram
            </Button>
          </VStack>
        </SectionCard>

        {error && <Alert status="error" borderRadius="lg"><AlertIcon />{error}</Alert>}
        {loading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="brand.400" />
            <Text mt={4} color="gray.400">Building architecture map...</Text>
          </Box>
        )}

        {diagram && (
          <VStack spacing={4} align="stretch">
            <SectionCard title="Architecture Diagram">
              <MermaidDiagram code={diagram.mermaid_code} />
              <HStack mt={4} justify="space-between">
                <Text color="gray.400" fontSize="sm">{diagram.description}</Text>
                <Text color="gray.500" fontSize="sm">{diagram.component_count} components</Text>
              </HStack>
            </SectionCard>

            <SectionCard title="Mermaid Source">
              <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.300" whiteSpace="pre">
                {diagram.mermaid_code}
              </Box>
            </SectionCard>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}
