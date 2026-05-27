import os
import json
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except Exception:
    genai = None  # type: ignore[assignment]
    _GENAI_AVAILABLE = False

_api_key = os.environ.get("GEMINI_API_KEY", "")
if _api_key and _GENAI_AVAILABLE:
    genai.configure(api_key=_api_key)

AGENT_INSTRUCTIONS: Dict[str, str] = {
    "Repository Scanner": (
        "You are an expert software archaeologist. Analyze the provided repository metadata "
        "and identify all technologies, frameworks, languages, databases, and build tools present. "
        "Assess the overall modernization risk (low/medium/high/critical). "
        "Return a structured JSON object with keys: frontend, backend, database, risk, languages, frameworks, summary."
    ),
    "Dependency Auditor": (
        "You are a security-focused dependency auditor. Analyze the provided dependency file content. "
        "Identify deprecated libraries, known vulnerabilities, unsupported versions, and legacy frameworks. "
        "For each finding include: file, severity (critical/warning/info), message, recommendation. "
        "Return JSON with keys: findings (array), total_critical, total_warnings, overall_risk."
    ),
    "Architecture Mapper": (
        "You are a software architect. Generate a Mermaid.js graph diagram showing the architecture "
        "of the legacy system based on the provided stack information. "
        "Use 'graph TD' syntax. Include frontend, backend, database, and API layers. "
        "Return JSON with keys: mermaid_code, description, component_count."
    ),
    "Java Modernizer": (
        "You are a Java modernization expert. Transform the provided legacy Java code (Spring MVC/Struts/JSP) "
        "to modern Spring Boot 3 with proper annotations, REST controllers, and clean architecture. "
        "Return JSON with keys: original_snippet, modernized_snippet, explanation, transformation_type."
    ),
    "Angular Modernizer": (
        "You are a frontend modernization expert. Transform AngularJS ($scope, controllers, directives) "
        "to modern React with TypeScript, hooks, and functional components. "
        "Return JSON with keys: original_snippet, modernized_snippet, explanation, transformation_type."
    ),
    "PHP Modernizer": (
        "You are a PHP modernization expert. Transform procedural PHP (mysql_query, global state) "
        "to modern Laravel or NestJS patterns with proper ORM, services, and MVC structure. "
        "Return JSON with keys: original_snippet, modernized_snippet, explanation, transformation_type."
    ),
    "Test Generator": (
        "You are a test automation engineer. Generate comprehensive unit and integration tests "
        "for the provided code. Use JUnit+Mockito for Java, Jest+React Testing Library for JS/TS, PHPUnit for PHP. "
        "Target 85%+ coverage. Return JSON with keys: framework, language, test_code, coverage_estimate, test_count."
    ),
    "Security Auditor": (
        "You are an OWASP-certified security engineer. Analyze the provided code or stack description "
        "for SQL injection, XSS, CSRF, exposed credentials, outdated auth, and other OWASP Top 10 vulnerabilities. "
        "Return JSON with keys: findings (array of {severity, category, description, file_hint, owasp_reference, remediation}), "
        "critical_count, high_count, overall_score (0-100, higher is safer)."
    ),
    "Migration Planner": (
        "You are a principal modernization strategist. Create a phased migration plan from the legacy stack "
        "to the modern target. Break work into 5 phases: dependency cleanup, testing foundation, "
        "backend modernization, frontend modernization, deployment. "
        "Return JSON with keys: source_stack, target_stack, phases (array of {phase_number, phase_name, tasks, risk_level, estimated_weeks}), "
        "total_weeks, executive_summary."
    ),
    "PR Writer": (
        "You are a senior engineering lead writing pull request documentation. "
        "Summarize the modernization changes into a clear, actionable PR description. "
        "Return JSON with keys: title, description, changes_summary, risk_level, components_affected, tests_added."
    ),
    "Risk Analysis Agent": (
        "You are a technical risk analyst. Evaluate the modernization risk of the described legacy system. "
        "Consider business continuity, data migration complexity, team skills, and deployment risk. "
        "Return a comprehensive risk assessment in JSON format."
    ),
}


class AgentOrchestrator:
    def __init__(self):
        self.model_name = "gemini-1.5-flash"
        self._model: Optional[Any] = None

    def _get_model(self):
        if self._model is None:
            self._model = genai.GenerativeModel(self.model_name)
        return self._model

    def _parse_json_response(self, text: str) -> Dict[str, Any]:
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            text = "\n".join(lines[1:-1]) if len(lines) > 2 else text
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {"raw_response": text}

    def delegate(self, agent_role: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        instructions = AGENT_INSTRUCTIONS.get(agent_role, "Execute modernization tasks safely.")
        prompt = f"{instructions}\n\nInput payload:\n{json.dumps(payload, indent=2)}\n\nRespond ONLY with valid JSON."

        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key or not _GENAI_AVAILABLE:
            return self._mock_response(agent_role, payload)

        try:
            model = self._get_model()
            response = model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            return {"error": str(e), "agent": agent_role}

    def _mock_response(self, agent_role: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Returns realistic mock data when no API key is configured."""
        mocks = {
            "Repository Scanner": {
                "frontend": "AngularJS 1.6",
                "backend": "Java Spring MVC 4",
                "database": "Oracle 11g",
                "risk": "high",
                "languages": ["Java", "JavaScript", "SQL"],
                "frameworks": ["Spring MVC", "AngularJS", "Hibernate"],
                "summary": "Legacy monolith with tight coupling between presentation and business layers. High modernization risk due to Oracle dependencies and AngularJS EOL status.",
            },
            "Dependency Auditor": {
                "findings": [
                    {"file": "package.json", "severity": "critical", "message": "angular 1.6.x is end-of-life", "recommendation": "Migrate to React 18 or Vue 3"},
                    {"file": "package.json", "severity": "critical", "message": "jquery 1.9.x has known XSS vulnerabilities", "recommendation": "Remove jQuery, use native DOM APIs or React"},
                    {"file": "pom.xml", "severity": "warning", "message": "spring-mvc 4.x reaches EOL — upgrade to Spring Boot 3", "recommendation": "Migrate to spring-boot-starter-web 3.x"},
                    {"file": "pom.xml", "severity": "warning", "message": "log4j 1.2.x has critical CVEs (CVE-2021-44228)", "recommendation": "Upgrade to log4j 2.x or use logback"},
                ],
                "total_critical": 2,
                "total_warnings": 2,
                "overall_risk": "high",
            },
            "Architecture Mapper": {
                "mermaid_code": (
                    "graph TD\n"
                    "    Browser[Browser] --> Angular[AngularJS 1.6 Frontend]\n"
                    "    Angular --> |HTTP/AJAX| API[Spring MVC Controllers]\n"
                    "    API --> Service[Service Layer]\n"
                    "    Service --> DAO[DAO / Hibernate]\n"
                    "    DAO --> DB[(Oracle 11g)]\n"
                    "    API --> Cache[EhCache]\n"
                    "    Service --> Queue[JMS Queue]\n"
                    "    API --> Auth[Spring Security]\n"
                    "    style Browser fill:#4A90D9\n"
                    "    style Angular fill:#E44D26\n"
                    "    style API fill:#6DB33F\n"
                    "    style DB fill:#F80000"
                ),
                "description": "Monolithic architecture with AngularJS SPA communicating via AJAX to Spring MVC REST-like endpoints backed by Oracle.",
                "component_count": 8,
            },
            "Migration Planner": {
                "source_stack": "AngularJS + Java Spring MVC + Oracle",
                "target_stack": "React + TypeScript + Spring Boot 3 + PostgreSQL",
                "phases": [
                    {"phase_number": 1, "phase_name": "Dependency Cleanup & Audit", "tasks": ["Upgrade log4j", "Remove CVE-affected libs", "Document all dependencies", "Set up SonarQube"], "risk_level": "low", "estimated_weeks": 2},
                    {"phase_number": 2, "phase_name": "Testing Foundation", "tasks": ["Add JUnit 5 test suite", "Set up Jest for frontend", "Achieve 60% coverage baseline", "Add CI pipeline"], "risk_level": "low", "estimated_weeks": 3},
                    {"phase_number": 3, "phase_name": "Backend Modernization", "tasks": ["Migrate Spring MVC → Spring Boot 3", "Replace Oracle with PostgreSQL", "Convert XML configs to YAML", "Implement REST API contracts"], "risk_level": "medium", "estimated_weeks": 6},
                    {"phase_number": 4, "phase_name": "Frontend Modernization", "tasks": ["Convert AngularJS controllers → React components", "Replace $scope with hooks", "Migrate routing to React Router", "Add TypeScript"], "risk_level": "medium", "estimated_weeks": 5},
                    {"phase_number": 5, "phase_name": "Deployment & Cutover", "tasks": ["Dockerize services", "Set up Kubernetes manifests", "Blue/green deployment", "Monitor and validate"], "risk_level": "low", "estimated_weeks": 2},
                ],
                "total_weeks": 18,
                "executive_summary": "18-week phased migration minimizing business disruption through incremental delivery and parallel running of legacy and modern systems.",
            },
            "Security Auditor": {
                "findings": [
                    {"severity": "critical", "category": "SQL Injection", "description": "Raw SQL string concatenation detected in UserDAO", "file_hint": "src/dao/UserDAO.java", "owasp_reference": "A03:2021", "remediation": "Use parameterized queries or JPA/Hibernate"},
                    {"severity": "high", "category": "XSS", "description": "Unescaped user input rendered in JSP templates", "file_hint": "views/user-profile.jsp", "owasp_reference": "A03:2021", "remediation": "Use JSTL <c:out> or escape all output"},
                    {"severity": "high", "category": "Outdated Auth", "description": "MD5 password hashing detected", "file_hint": "src/service/AuthService.java", "owasp_reference": "A02:2021", "remediation": "Migrate to bcrypt or Argon2"},
                    {"severity": "medium", "category": "CSRF", "description": "No CSRF tokens in form submissions", "file_hint": "views/forms/", "owasp_reference": "A01:2021", "remediation": "Enable Spring Security CSRF protection"},
                ],
                "critical_count": 1,
                "high_count": 2,
                "overall_score": 32,
            },
            "Java Modernizer": {
                "original_snippet": "@Controller\npublic class UserController {\n    @Autowired\n    private UserService userService;\n\n    @RequestMapping(\"/users\")\n    public ModelAndView getUsers() {\n        List<User> users = userService.findAll();\n        ModelAndView mav = new ModelAndView(\"users\");\n        mav.addObject(\"users\", users);\n        return mav;\n    }\n}",
                "modernized_snippet": "@RestController\n@RequestMapping(\"/api/v1/users\")\n@RequiredArgsConstructor\npublic class UserController {\n    private final UserService userService;\n\n    @GetMapping\n    public ResponseEntity<List<UserDto>> getUsers() {\n        return ResponseEntity.ok(userService.findAll());\n    }\n}",
                "explanation": "Converted from Spring MVC ModelAndView pattern to Spring Boot 3 REST controller returning JSON. Added constructor injection via @RequiredArgsConstructor, proper HTTP semantics via ResponseEntity, and versioned API path.",
                "transformation_type": "Spring MVC → Spring Boot 3 REST",
            },
            "PR Writer": {
                "title": "feat: migrate AngularJS frontend to React + TypeScript",
                "description": "## Migration Summary\n\nThis PR completes Phase 4 of the Phoenix modernization plan, converting the AngularJS 1.6 frontend to React 18 with TypeScript.\n\n### Changes\n- Converted 38 AngularJS controllers to React functional components\n- Replaced `$scope` state management with `useState`/`useReducer` hooks\n- Migrated `$routeProvider` routing to React Router v6\n- Added TypeScript interfaces for all API response types\n\n### Tests Added\n- 94 Jest unit tests\n- 12 Playwright E2E test scenarios\n\n### Risk Assessment\n**Low** — legacy system remains live in parallel until smoke tests pass.",
                "changes_summary": "38 components migrated, routing upgraded, TypeScript added",
                "risk_level": "low",
                "components_affected": 38,
                "tests_added": 106,
            },
        }
        return mocks.get(agent_role, {"message": "Mock response — configure GEMINI_API_KEY for live AI analysis"})


orchestrator = AgentOrchestrator()
