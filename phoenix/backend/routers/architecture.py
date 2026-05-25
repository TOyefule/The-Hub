from fastapi import APIRouter, HTTPException
from models import ArchitectureDiagram, MigrationRequest
from agents.orchestrator import orchestrator

router = APIRouter(prefix="/api/v1/architecture", tags=["architecture"])


@router.post("/map", response_model=ArchitectureDiagram)
async def generate_architecture_map(request: MigrationRequest):
    result = orchestrator.delegate(
        "Architecture Mapper",
        {"frontend": request.frontend, "backend": request.backend, "database": request.database},
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
