import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import intake, audit, architecture, refactor

load_dotenv()

app = FastAPI(
    title="Phoenix Modernization Engine",
    description="AI-powered legacy code modernization platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(intake.router)
app.include_router(audit.router)
app.include_router(architecture.router)
app.include_router(refactor.router)


@app.get("/api/v1/health")
async def health():
    gemini_configured = bool(os.environ.get("GEMINI_API_KEY"))
    return {
        "status": "ok",
        "gemini_configured": gemini_configured,
        "mode": "live" if gemini_configured else "demo",
    }
