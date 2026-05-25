import { useRef, useState } from 'react'
import {
  Box, Button, VStack, Text, HStack, Spinner, Alert, AlertIcon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Stat, StatLabel,
  StatNumber, SimpleGrid,
} from '@chakra-ui/react'
import { SectionCard } from '../components/SectionCard'
import { RiskBadge } from '../components/RiskBadge'
import type { AuditReport } from '../types'
import { api } from '../api'

export function Audit() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFile = async (file: File) => {
    setLoading(true)
    setError('')
    setFileName(file.name)
    try {
      const data = await api.auditDependencies(file)
      setReport(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Audit failed')
    }
    setLoading(false)
  }

  const severityColor = (s: string) => ({ critical: 'red.400', warning: 'orange.400', info: 'blue.400' }[s] ?? 'gray.400')

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>
      <VStack spacing={6} align="stretch">
        <SectionCard title="Dependency Audit" accent>
          <VStack spacing={4} align="stretch">
            <Text color="gray.400" fontSize="sm">
              Upload a dependency manifest: <code>package.json</code>, <code>pom.xml</code>, or <code>composer.json</code>
            </Text>
            <HStack>
              <Box
                flex={1} p={4} borderWidth="2px" borderStyle="dashed" borderColor="gray.600"
                borderRadius="lg" cursor="pointer" bg="gray.900"
                _hover={{ borderColor: 'brand.400' }}
                onClick={() => inputRef.current?.click()}
              >
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  {fileName || 'Click to select file or drag & drop'}
                </Text>
              </Box>
              <input
                ref={inputRef} type="file" hidden
                accept=".json,.xml"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </HStack>
            <Text fontSize="xs" color="gray.600">
              No file? Try a mock scan — any file triggers a demo audit in demo mode.
            </Text>
          </VStack>
        </SectionCard>

        {error && <Alert status="error" borderRadius="lg"><AlertIcon />{error}</Alert>}
        {loading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="brand.400" />
            <Text mt={4} color="gray.400">Scanning dependencies for vulnerabilities...</Text>
          </Box>
        )}

        {report && (
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 3 }} spacing={4}>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="red.800">
                <Stat><StatLabel color="red.400">Critical</StatLabel><StatNumber color="red.400">{report.total_critical}</StatNumber></Stat>
              </Box>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="orange.800">
                <Stat><StatLabel color="orange.400">Warnings</StatLabel><StatNumber color="orange.400">{report.total_warnings}</StatNumber></Stat>
              </Box>
              <Box p={4} bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="gray.700">
                <Stat>
                  <StatLabel color="gray.400">Overall Risk</StatLabel>
                  <Box mt={1}><RiskBadge level={report.overall_risk} /></Box>
                </Stat>
              </Box>
            </SimpleGrid>

            <SectionCard title="Findings">
              <TableContainer>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="gray.500">Severity</Th>
                      <Th color="gray.500">File</Th>
                      <Th color="gray.500">Issue</Th>
                      <Th color="gray.500">Recommendation</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {report.findings.map((f, i) => (
                      <Tr key={i} _hover={{ bg: 'gray.700' }}>
                        <Td><Text color={severityColor(f.severity)} fontWeight="semibold" fontSize="xs">{f.severity.toUpperCase()}</Text></Td>
                        <Td><Text fontSize="xs" color="gray.300" fontFamily="mono">{f.file}</Text></Td>
                        <Td><Text fontSize="xs" color="gray.300">{f.message}</Text></Td>
                        <Td><Text fontSize="xs" color="green.300">{f.recommendation}</Text></Td>
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
