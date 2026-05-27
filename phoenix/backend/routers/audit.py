from fastapi import APIRouter, UploadFile, File, HTTPException
from models import AuditReport, MigrationRequest, MigrationPlan
from agents.orchestrator import orchestrator

router = APIRouter(prefix="/api/v1/audit", tags=["audit"])


@router.post("/dependencies", response_model=AuditReport)
async def audit_dependencies(file: UploadFile = File(...)):
    content = await file.read()
    result = orchestrator.delegate(
        "Dependency Auditor",
        {"filename": file.filename, "content": content.decode("utf-8", errors="replace")},
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@router.post("/security")
async def security_audit(request: MigrationRequest):
    result = orchestrator.delegate(
        "Security Auditor",
        {"frontend": request.frontend, "backend": request.backend, "database": request.database},
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@router.post("/migration-plan", response_model=MigrationPlan)
async def generate_migration_plan(request: MigrationRequest):
    result = orchestrator.delegate(
        "Migration Planner",
        {
            "frontend": request.frontend,
            "backend": request.backend,
            "database": request.database,
            "target_stack": request.target_stack,
        },
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
