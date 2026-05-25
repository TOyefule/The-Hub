from fastapi import APIRouter, HTTPException
from models import RefactorRequest, RefactorResult, TestSuite, PRSummary
from agents.orchestrator import orchestrator

router = APIRouter(prefix="/api/v1/refactor", tags=["refactor"])

AGENT_MAP = {
    "java": "Java Modernizer",
    "angularjs": "Angular Modernizer",
    "php": "PHP Modernizer",
    "javascript": "Angular Modernizer",
}


@router.post("/code", response_model=RefactorResult)
async def refactor_code(request: RefactorRequest):
    agent = AGENT_MAP.get(request.source_language.lower(), "Java Modernizer")
    result = orchestrator.delegate(
        agent,
        {
            "code": request.code,
            "source_language": request.source_language,
            "target_framework": request.target_framework,
            "context": request.context,
        },
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@router.post("/tests", response_model=TestSuite)
async def generate_tests(request: RefactorRequest):
    result = orchestrator.delegate(
        "Test Generator",
        {
            "code": request.code,
            "source_language": request.source_language,
            "target_framework": request.target_framework,
        },
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@router.post("/pr-summary", response_model=PRSummary)
async def generate_pr_summary(request: RefactorRequest):
    result = orchestrator.delegate(
        "PR Writer",
        {
            "code": request.code,
            "source_language": request.source_language,
            "target_framework": request.target_framework,
            "context": request.context,
        },
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
