import { useState } from 'react'
import {
  Box, Button, VStack, Text, SimpleGrid, Input, Spinner, Alert, AlertIcon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, CircularProgress,
  CircularProgressLabel, HStack,
} from '@chakra-ui/react'
import { SectionCard } from '../components/SectionCard'
import { RiskBadge } from '../components/RiskBadge'
import type { SecurityReport } from '../types'
import { api } from '../api'

export function Security() {
  const [form, setForm] = useState({ frontend: 'AngularJS', backend: 'Java Spring MVC', database: 'Oracle' })
  const [report, setReport] = useState<SecurityReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScan = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.securityAudit(form.frontend, form.backend, form.database)
      setReport(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Security scan failed')
    }
    setLoading(false)
  }

  const scoreColor = (s: number) => s >= 70 ? 'green.400' : s >= 40 ? 'yellow.400' : 'red.400'

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>
      <VStack spacing={6} align="stretch">
        <SectionCard title="Security Audit (OWASP Top 10)" accent>
          <VStack spacing={4} align="stretch">
            <Text color="gray.400" fontSize="sm">
              Run an OWASP-based security audit against your legacy stack profile.
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
            <Button colorScheme="cyan" onClick={handleScan} isLoading={loading} alignSelf="flex-start">
              Run Security Audit
            </Button>
          </VStack>
        </SectionCard>

        {error && <Alert status="error" borderRadius="lg"><AlertIcon />{error}</Alert>}
        {loading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="brand.400" />
            <Text mt={4} color="gray.400">Running OWASP vulnerability analysis...</Text>
          </Box>
        )}

        {report && (
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 3 }} spacing={4}>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="gray.700" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress value={report.overall_score} color={scoreColor(report.overall_score)} size="80px" trackColor="gray.700">
                  <CircularProgressLabel color={scoreColor(report.overall_score)} fontSize="sm" fontWeight="bold">
                    {report.overall_score}
                  </CircularProgressLabel>
                </CircularProgress>
                <Text ml={3} color="gray.400" fontSize="sm">Security<br />Score</Text>
              </Box>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="red.800">
                <Text color="red.400" fontSize="xs">Critical</Text>
                <Text color="red.400" fontSize="3xl" fontWeight="bold">{report.critical_count}</Text>
              </Box>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="orange.800">
                <Text color="orange.400" fontSize="xs">High</Text>
                <Text color="orange.400" fontSize="3xl" fontWeight="bold">{report.high_count}</Text>
              </Box>
            </SimpleGrid>

            <SectionCard title="Vulnerability Findings">
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th color="gray.500">Severity</Th>
                      <Th color="gray.500">Category</Th>
                      <Th color="gray.500">Description</Th>
                      <Th color="gray.500">OWASP</Th>
                      <Th color="gray.500">Remediation</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {report.findings.map((f, i) => (
                      <Tr key={i} _hover={{ bg: 'gray.700' }}>
                        <Td><RiskBadge level={f.severity} /></Td>
                        <Td><Text fontSize="xs" color="gray.300">{f.category}</Text></Td>
                        <Td><Text fontSize="xs" color="gray.300">{f.description}</Text></Td>
                        <Td><Text fontSize="xs" color="blue.300" fontFamily="mono">{f.owasp_reference}</Text></Td>
                        <Td><Text fontSize="xs" color="green.300">{f.remediation}</Text></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </SectionCard>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}
