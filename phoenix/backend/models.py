from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ScanResult(BaseModel):
    frontend: str
    backend: str
    database: str
    risk: str
    languages: List[str]
    frameworks: List[str]
    summary: str


class DependencyFinding(BaseModel):
    file: str
    severity: str  # critical | warning | info
    message: str
    recommendation: str


class AuditReport(BaseModel):
    findings: List[DependencyFinding]
    total_critical: int
    total_warnings: int
    overall_risk: str


class MigrationPhase(BaseModel):
    phase_number: int
    phase_name: str
    tasks: List[str]
    risk_level: str
    estimated_weeks: int


class MigrationPlan(BaseModel):
    source_stack: str
    target_stack: str
    phases: List[MigrationPhase]
    total_weeks: int
    executive_summary: str


class ArchitectureDiagram(BaseModel):
    mermaid_code: str
    description: str
    component_count: int


class SecurityFinding(BaseModel):
    severity: str  # critical | high | medium | low
    category: str
    description: str
    file_hint: str
    owasp_reference: str
    remediation: str


class SecurityReport(BaseModel):
    findings: List[SecurityFinding]
    critical_count: int
    high_count: int
    overall_score: int  # 0-100


class TestSuite(BaseModel):
    framework: str
    language: str
    test_code: str
    coverage_estimate: int
    test_count: int


class PRSummary(BaseModel):
    title: str
    description: str
    changes_summary: str
    risk_level: str
    components_affected: int
    tests_added: int


class RefactorResult(BaseModel):
    original_snippet: str
    modernized_snippet: str
    explanation: str
    transformation_type: str


class IntakeRequest(BaseModel):
    repo_url: str
    target_stack: Optional[str] = "auto"


class RefactorRequest(BaseModel):
    code: str
    source_language: str
    target_framework: str
    context: Optional[str] = ""


class MigrationRequest(BaseModel):
    frontend: str
    backend: str
    database: str
    target_stack: Optional[str] = "modern"
