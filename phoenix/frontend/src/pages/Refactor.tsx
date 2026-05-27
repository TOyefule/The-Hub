import { useState } from 'react'
import {
  Box, Button, VStack, Text, Textarea, Select, HStack, Spinner,
  Alert, AlertIcon, Tabs, TabList, TabPanels, Tab, TabPanel, SimpleGrid,
} from '@chakra-ui/react'
import { SectionCard } from '../components/SectionCard'
import { CodeBlock } from '../components/CodeBlock'
import type { RefactorResult } from '../types'
import { api } from '../api'

const SAMPLES: Record<string, { code: string; lang: string; target: string }> = {
  java: {
    code: `@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping("/users")
    public ModelAndView getUsers() {
        List<User> users = userService.findAll();
        ModelAndView mav = new ModelAndView("users");
        mav.addObject("users", users);
        return mav;
    }
}`,
    lang: 'java',
    target: 'Spring Boot 3',
  },
  angularjs: {
    code: `app.controller('UserController', function($scope, UserService) {
    $scope.users = [];
    $scope.loading = false;

    $scope.loadUsers = function() {
        $scope.loading = true;
        UserService.getAll().then(function(data) {
            $scope.users = data;
            $scope.loading = false;
        });
    };
});`,
    lang: 'angularjs',
    target: 'React + TypeScript',
  },
  php: {
    code: `<?php
$conn = mysql_connect("localhost", "user", "pass");
mysql_select_db("mydb");
$result = mysql_query("SELECT * FROM users WHERE id = " . $_GET['id']);
while ($row = mysql_fetch_array($result)) {
    echo $row['name'];
}
mysql_close($conn);`,
    lang: 'php',
    target: 'Laravel',
  },
}

const langLabels: Record<string, string> = { java: 'Java', angularjs: 'JavaScript (AngularJS)', php: 'PHP' }
const codeBlockLang: Record<string, string> = { java: 'java', angularjs: 'javascript', php: 'php' }

export function Refactor() {
  const [selected, setSelected] = useState<keyof typeof SAMPLES>('java')
  const [code, setCode] = useState(SAMPLES.java.code)
  const [sourceLang, setSourceLang] = useState('java')
  const [targetFw, setTargetFw] = useState('Spring Boot 3')
  const [result, setResult] = useState<RefactorResult | null>(null)
  const [tests, setTests] = useState<{ test_code: string; framework: string; coverage_estimate: number; test_count: number } | null>(null)
  const [pr, setPr] = useState<{ title: string; description: string; risk_level: string } | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadSample = (key: keyof typeof SAMPLES) => {
    setSelected(key)
    setCode(SAMPLES[key].code)
    setSourceLang(SAMPLES[key].lang)
    setTargetFw(SAMPLES[key].target)
    setResult(null)
    setTests(null)
    setPr(null)
  }

  const handleRefactor = async () => {
    setLoading('refactor')
    setError('')
    try {
      setResult(await api.refactorCode(code, sourceLang, targetFw))
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    setLoading(null)
  }

  const handleTests = async () => {
    setLoading('tests')
    setError('')
    try {
      setTests(await api.generateTests(code, sourceLang, targetFw))
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    setLoading(null)
  }

  const handlePR = async () => {
    setLoading('pr')
    setError('')
    try {
      setPr(await api.generatePR(code, sourceLang, targetFw))
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    setLoading(null)
  }

  return (
    <Box maxW="1200px" mx="auto" px={6} py={8}>
      <VStack spacing={6} align="stretch">
        <SectionCard title="AI Refactor Engine" accent>
          <VStack spacing={4} align="stretch">
            <HStack spacing={2} flexWrap="wrap">
              <Text fontSize="sm" color="gray.500">Load sample:</Text>
              {(Object.keys(SAMPLES) as Array<keyof typeof SAMPLES>).map((k) => (
                <Button key={k} size="xs" variant={selected === k ? 'solid' : 'outline'}
                  colorScheme="cyan" onClick={() => loadSample(k)}>
                  {k.toUpperCase()}
                </Button>
              ))}
            </HStack>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              bg="gray.900" borderColor="gray.600" fontFamily="mono" fontSize="sm"
              rows={12} _focus={{ borderColor: 'brand.400' }}
              placeholder="Paste your legacy code here..."
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>Source Language</Text>
                <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}
                  bg="gray.900" borderColor="gray.600" size="sm">
                  <option value="java">Java</option>
                  <option value="angularjs">AngularJS</option>
                  <option value="php">PHP</option>
                  <option value="javascript">JavaScript</option>
                </Select>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>Target Framework</Text>
                <Select value={targetFw} onChange={(e) => setTargetFw(e.target.value)}
                  bg="gray.900" borderColor="gray.600" size="sm">
                  <option>Spring Boot 3</option>
                  <option>React + TypeScript</option>
                  <option>Laravel</option>
                  <option>NestJS</option>
                  <option>Vue 3</option>
                  <option>Next.js</option>
                </Select>
              </Box>
            </SimpleGrid>
            <HStack spacing={3} flexWrap="wrap">
              <Button colorScheme="cyan" onClick={handleRefactor} isLoading={loading === 'refactor'} loadingText="Refactoring">
                Modernize Code
              </Button>
              <Button variant="outline" colorScheme="green" onClick={handleTests} isLoading={loading === 'tests'}>
                Generate Tests
              </Button>
              <Button variant="outline" colorScheme="purple" onClick={handlePR} isLoading={loading === 'pr'}>
                Write PR Summary
              </Button>
            </HStack>
          </VStack>
        </SectionCard>

        {error && <Alert status="error" borderRadius="lg"><AlertIcon />{error}</Alert>}
        {loading && (
          <HStack justify="center" py={6}>
            <Spinner color="brand.400" />
            <Text color="gray.400">Processing with AI agents...</Text>
          </HStack>
        )}

        {result && (
          <SectionCard title={`Transformation: ${result.transformation_type}`}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="xs" color="orange.400" mb={2} fontWeight="semibold">BEFORE (Legacy)</Text>
                <CodeBlock code={result.original_snippet} language={codeBlockLang[sourceLang] ?? 'java'} />
              </Box>
              <Box>
                <Text fontSize="xs" color="green.400" mb={2} fontWeight="semibold">AFTER (Modern)</Text>
                <CodeBlock code={result.modernized_snippet} language={codeBlockLang[sourceLang] ?? 'java'} />
              </Box>
            </SimpleGrid>
            <Box mt={4} p={4} bg="gray.900" borderRadius="lg">
              <Text fontSize="sm" color="gray.300">{result.explanation}</Text>
            </Box>
          </SectionCard>
        )}

        {tests && (
          <SectionCard title={`Generated Tests — ${tests.framework}`}>
            <HStack mb={3} spacing={4}>
              <Text fontSize="sm" color="gray.400">Framework: <Text as="span" color="white">{tests.framework}</Text></Text>
              <Text fontSize="sm" color="gray.400">Tests: <Text as="span" color="brand.400">{tests.test_count}</Text></Text>
              <Text fontSize="sm" color="gray.400">Est. Coverage: <Text as="span" color="green.400">{tests.coverage_estimate}%</Text></Text>
            </HStack>
            <CodeBlock code={tests.test_code} language="java" />
          </SectionCard>
        )}

        {pr && (
          <SectionCard title="Pull Request Summary">
            <Box mb={3} p={3} bg="gray.900" borderRadius="lg">
              <Text fontSize="xs" color="gray.500" mb={1}>PR Title</Text>
              <Text fontFamily="mono" color="brand.400">{pr.title}</Text>
            </Box>
            <Box p={4} bg="gray.900" borderRadius="lg" whiteSpace="pre-wrap" fontFamily="mono" fontSize="sm" color="gray.300">
              {pr.description}
            </Box>
          </SectionCard>
        )}
      </VStack>
    </Box>
  )
}
