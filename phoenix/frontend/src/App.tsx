import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { Intake } from './pages/Intake'
import { Audit } from './pages/Audit'
import { Architecture } from './pages/Architecture'
import { Security } from './pages/Security'
import { Migration } from './pages/Migration'
import { Refactor } from './pages/Refactor'
import type { HealthStatus } from './types'
import { api } from './api'

export default function App() {
  const [health, setHealth] = useState<HealthStatus | undefined>()

  useEffect(() => {
    api.health().then(setHealth).catch(() => {})
  }, [])

  return (
    <Box minH="100vh" bg="gray.950">
      <Navbar health={health} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/security" element={<Security />} />
        <Route path="/migration" element={<Migration />} />
        <Route path="/refactor" element={<Refactor />} />
      </Routes>
    </Box>
  )
}
