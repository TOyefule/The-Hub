import type {
  ScanResult, AuditReport, MigrationPlan,
  ArchitectureDiagram, SecurityReport, RefactorResult, PRSummary, HealthStatus,
} from './types'

const BASE = '/api/v1'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }
  return res.json()
}

async function postForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }
  return res.json()
}

export const api = {
  health: (): Promise<HealthStatus> =>
    fetch(`${BASE}/health`).then((r) => r.json()),

  intake: (repo_url: string, target_stack = 'auto'): Promise<ScanResult> =>
    post('/intake', { repo_url, target_stack }),

  auditDependencies: (file: File): Promise<AuditReport> => {
    const fd = new FormData()
    fd.append('file', file)
    return postForm('/audit/dependencies', fd)
  },

  securityAudit: (frontend: string, backend: string, database: string): Promise<SecurityReport> =>
    post('/audit/security', { frontend, backend, database }),

  migrationPlan: (frontend: string, backend: string, database: string, target_stack = 'modern'): Promise<MigrationPlan> =>
    post('/audit/migration-plan', { frontend, backend, database, target_stack }),

  architectureMap: (frontend: string, backend: string, database: string): Promise<ArchitectureDiagram> =>
    post('/architecture/map', { frontend, backend, database }),

  refactorCode: (code: string, source_language: string, target_framework: string, context = ''): Promise<RefactorResult> =>
    post('/refactor/code', { code, source_language, target_framework, context }),

  generateTests: (code: string, source_language: string, target_framework: string): Promise<{ framework: string; language: string; test_code: string; coverage_estimate: number; test_count: number }> =>
    post('/refactor/tests', { code, source_language, target_framework }),

  generatePR: (code: string, source_language: string, target_framework: string, context = ''): Promise<PRSummary> =>
    post('/refactor/pr-summary', { code, source_language, target_framework, context }),
}
