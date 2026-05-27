export interface ScanResult {
  frontend: string
  backend: string
  database: string
  risk: 'low' | 'medium' | 'high' | 'critical'
  languages: string[]
  frameworks: string[]
  summary: string
}

export interface DependencyFinding {
  file: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  recommendation: string
}

export interface AuditReport {
  findings: DependencyFinding[]
  total_critical: number
  total_warnings: number
  overall_risk: string
}

export interface MigrationPhase {
  phase_number: number
  phase_name: string
  tasks: string[]
  risk_level: string
  estimated_weeks: number
}

export interface MigrationPlan {
  source_stack: string
  target_stack: string
  phases: MigrationPhase[]
  total_weeks: number
  executive_summary: string
}

export interface ArchitectureDiagram {
  mermaid_code: string
  description: string
  component_count: number
}

export interface SecurityFinding {
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  description: string
  file_hint: string
  owasp_reference: string
  remediation: string
}

export interface SecurityReport {
  findings: SecurityFinding[]
  critical_count: number
  high_count: number
  overall_score: number
}

export interface RefactorResult {
  original_snippet: string
  modernized_snippet: string
  explanation: string
  transformation_type: string
}

export interface PRSummary {
  title: string
  description: string
  changes_summary: string
  risk_level: string
  components_affected: number
  tests_added: number
}

export interface HealthStatus {
  status: string
  gemini_configured: boolean
  mode: 'live' | 'demo'
}
