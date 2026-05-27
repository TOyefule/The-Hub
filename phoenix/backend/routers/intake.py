from fastapi import APIRouter, HTTPException
from models import IntakeRequest, ScanResult
from agents.orchestrator import orchestrator

router = APIRouter(prefix="/api/v1/intake", tags=["intake"])


@router.post("", response_model=ScanResult)
async def analyze_repository(request: IntakeRequest):
    payload = {
        "repo_url": request.repo_url,
        "target_stack": request.target_stack,
        "hint": "Analyze this repository URL and identify the technology stack",
    }
    result = orchestrator.delegate("Repository Scanner", payload)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
