import {
  Box, Grid, GridItem, Heading, Text, VStack, HStack,
  Stat, StatLabel, StatNumber, StatHelpText, Icon, SimpleGrid,
} from '@chakra-ui/react'
import { SectionCard } from '../components/SectionCard'

const stats = [
  { label: 'Cost Reduction', value: '70%', help: 'vs manual modernization' },
  { label: 'Time Saved', value: '60%', help: 'faster migration' },
  { label: 'Deployment Velocity', value: '5x', help: 'increase' },
  { label: 'Tech Debt Reduced', value: '80%', help: 'after full migration' },
]

const agents = [
  { name: 'Repository Scanner', icon: '🔍', desc: 'Identifies tech stack and languages' },
  { name: 'Dependency Auditor', icon: '📦', desc: 'CVE and deprecation analysis' },
  { name: 'Architecture Mapper', icon: '🗺️', desc: 'Generates Mermaid diagrams' },
  { name: 'Java Modernizer', icon: '☕', desc: 'Spring MVC → Spring Boot 3' },
  { name: 'Angular Modernizer', icon: '⚡', desc: 'AngularJS → React + TypeScript' },
  { name: 'PHP Modernizer', icon: '🐘', desc: 'Procedural PHP → Laravel/NestJS' },
  { name: 'Test Generator', icon: '🧪', desc: 'JUnit, Jest, Playwright suites' },
  { name: 'Security Auditor', icon: '🔐', desc: 'OWASP Top 10 scanning' },
  { name: 'Migration Planner', icon: '📋', desc: 'Phased modernization roadmap' },
  { name: 'PR Writer', icon: '📝', desc: 'Pull request documentation' },
]

const workflow = [
  'Import Repository',
  'Analyze Architecture',
  'Dependency Scan',
  'Generate Strategy',
  'Create PR Batches',
  'Generate Tests',
  'Deploy Sandbox',
  'Human Approval',
  'Merge',
]

export function Dashboard() {
  return (
    <Box maxW="1400px" mx="auto" px={6} py={8}>
      <VStack spacing={2} align="flex-start" mb={10}>
        <Heading size="2xl" bgGradient="linear(to-r, brand.400, purple.400)" bgClip="text">
          Phoenix Modernization Engine
        </Heading>
        <Text color="gray.400" fontSize="lg">
          AI-powered legacy code transformation — incremental, low-risk, production-ready.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
        {stats.map((s) => (
          <Box key={s.label} p={5} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="gray.700">
            <Stat>
              <StatLabel color="gray.400" fontSize="sm">{s.label}</StatLabel>
              <StatNumber fontSize="3xl" color="brand.400">{s.value}</StatNumber>
              <StatHelpText color="gray.500" mb={0}>{s.help}</StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={8}>
        <SectionCard title="10-Agent Architecture">
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            {agents.map((a) => (
              <HStack key={a.name} p={3} bg="gray.900" borderRadius="lg" spacing={3}>
                <Text fontSize="xl">{a.icon}</Text>
                <Box>
                  <Text fontWeight="semibold" fontSize="sm">{a.name}</Text>
                  <Text fontSize="xs" color="gray.500">{a.desc}</Text>
                </Box>
              </HStack>
            ))}
          </SimpleGrid>
        </SectionCard>

        <SectionCard title="9-Step Workflow" accent>
          <VStack spacing={0} align="stretch">
            {workflow.map((step, i) => (
              <HStack key={step} spacing={3} py={2} borderBottomWidth={i < workflow.length - 1 ? '1px' : '0'} borderColor="gray.700">
                <Box
                  w={7} h={7} borderRadius="full" bg="brand.500"
                  display="flex" alignItems="center" justifyContent="center"
                  fontSize="xs" fontWeight="bold" flexShrink={0}
                >
                  {i + 1}
                </Box>
                <Text fontSize="sm">{step}</Text>
              </HStack>
            ))}
          </VStack>
        </SectionCard>
      </Grid>

      <SectionCard title="Supported Transformations">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
          {[
            ['AngularJS', 'React + TypeScript'],
            ['AngularJS', 'Vue 3 / Next.js'],
            ['Java Spring MVC', 'Spring Boot 3'],
            ['Java Monolith', 'Microservices'],
            ['PHP Procedural', 'Laravel'],
            ['PHP Procedural', 'NestJS'],
            ['jQuery', 'React'],
            ['SOAP APIs', 'REST / GraphQL'],
          ].map(([from, to]) => (
            <HStack key={`${from}-${to}`} p={3} bg="gray.900" borderRadius="lg" fontSize="sm">
              <Text color="orange.300" flex={1}>{from}</Text>
              <Text color="gray.500">→</Text>
              <Text color="green.300" flex={1}>{to}</Text>
            </HStack>
          ))}
        </SimpleGrid>
      </SectionCard>
    </Box>
  )
}
