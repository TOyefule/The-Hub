import { useState } from 'react'
import {
  Box, Button, VStack, Text, HStack, Input, Spinner, Alert, AlertIcon,
  SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel,
  AccordionIcon, UnorderedList, ListItem,
} from '@chakra-ui/react'
import { SectionCard } from '../components/SectionCard'
import { RiskBadge } from '../components/RiskBadge'
import type { MigrationPlan } from '../types'
import { api } from '../api'

const riskColors: Record<string, string> = { low: 'green.400', medium: 'yellow.400', high: 'orange.400' }

export function Migration() {
  const [form, setForm] = useState({ frontend: 'AngularJS', backend: 'Java Spring MVC', database: 'Oracle' })
  const [plan, setPlan] = useState<MigrationPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.migrationPlan(form.frontend, form.backend, form.database)
      setPlan(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate plan')
    }
    setLoading(false)
  }

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>
      <VStack spacing={6} align="stretch">
        <SectionCard title="Incremental Migration Planner" accent>
          <VStack spacing={4} align="stretch">
            <Text color="gray.400" fontSize="sm">
              Generate a phased modernization roadmap. No big bang rewrites — incremental, low-risk delivery.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {(['frontend', 'backend', 'database'] as const).map((field) => (
                <Box key={field}>
                  <Text fontSize="xs" color="gray.500" mb={1} textTransform="capitalize">{field}</Text>
                  <Input value={form[field]} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                    bg="gray.900" borderColor="gray.600" _focus={{ borderColor: 'brand.400' }} size="sm" />
                </Box>
              ))}
            </SimpleGrid>
            <Button colorScheme="cyan" onClick={handleGenerate} isLoading={loading} loadingText="Planning" alignSelf="flex-start">
              Generate Migration Plan
            </Button>
          </VStack>
        </SectionCard>

        {error && <Alert status="error" borderRadius="lg"><AlertIcon />{error}</Alert>}
        {loading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="brand.400" />
            <Text mt={4} color="gray.400">Building phased migration roadmap...</Text>
          </Box>
        )}

        {plan && (
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="gray.700">
                <Text fontSize="xs" color="gray.500">From</Text>
                <Text color="orange.300" fontWeight="semibold" mt={1}>{plan.source_stack}</Text>
              </Box>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="gray.700">
                <Text fontSize="xs" color="gray.500">To</Text>
                <Text color="green.300" fontWeight="semibold" mt={1}>{plan.target_stack}</Text>
              </Box>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="brand.600">
                <Text fontSize="xs" color="gray.500">Total Duration</Text>
                <Text color="brand.400" fontSize="2xl" fontWeight="bold" mt={1}>{plan.total_weeks} weeks</Text>
              </Box>
            </SimpleGrid>

            <SectionCard title="Executive Summary">
              <Text color="gray.300" lineHeight="tall">{plan.executive_summary}</Text>
            </SectionCard>

            <SectionCard title="Migration Phases">
              <Accordion allowToggle>
                {plan.phases.map((phase) => (
                  <AccordionItem key={phase.phase_number} border="none" mb={2}>
                    <AccordionButton
                      bg="gray.900" borderRadius="lg" p={4} _hover={{ bg: 'gray.700' }}
                      _expanded={{ bg: 'gray.700', borderBottomRadius: 0 }}
                    >
                      <HStack flex={1} justify="space-between" align="center">
                        <HStack spacing={3}>
                          <Box w={7} h={7} borderRadius="full" bg="brand.500" display="flex"
                            alignItems="center" justifyContent="center" fontSize="xs" fontWeight="bold">
                            {phase.phase_number}
                          </Box>
                          <Text fontWeight="semibold">{phase.phase_name}</Text>
                        </HStack>
                        <HStack spacing={3}>
                          <Text fontSize="sm" color="gray.400">{phase.estimated_weeks}w</Text>
                          <RiskBadge level={phase.risk_level} />
                        </HStack>
                      </HStack>
                      <AccordionIcon ml={2} />
                    </AccordionButton>
                    <AccordionPanel bg="gray.700" borderBottomRadius="lg" pt={3} pb={4}>
                      <UnorderedList spacing={1} pl={4}>
                        {phase.tasks.map((task, i) => (
                          <ListItem key={i} fontSize="sm" color="gray.300">{task}</ListItem>
                        ))}
                      </UnorderedList>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </SectionCard>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}
