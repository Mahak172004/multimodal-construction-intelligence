import logging
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from backend.config import settings
from backend.models.schemas import (
    SafetyInspectionResponse,
    CrackAnalysisResponse,
    ValuationRequest,
    ValuationResponse,
    ProjectPlanRequest,
    ProjectPlanResponse,
    DailyLogRequest,
    DailyLogResponse,
    WeatherAdvisoryRequest,
    WeatherAdvisoryResponse,
    ChatQuery,
    ChatResponse
)
from backend.services.safety_service import analyze_site_safety
from backend.services.crack_service import analyze_crack_defect
from backend.services.valuation_service import calculate_valuation
from backend.services.planner_service import generate_project_plan
from backend.services.site_log_service import process_daily_log
from backend.services.weather_service import evaluate_weather_risks
from backend.services.assistant_service import answer_construction_query
from backend.services.gemini_service import gemini_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("construction_intelligence")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal Construction Intelligence Platform API - Powering AI-driven safety monitoring, crack defect analysis, real estate valuation, project planning, daily site reports, weather advisory, and engineering assistance."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "gemini_ai_configured": gemini_service.is_configured()
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_configured": gemini_service.is_configured(),
        "model": settings.GEMINI_MODEL,
        "version": settings.VERSION
    }

# 1. Safety Monitoring Endpoint (Multimodal Image)
@app.post("/api/v1/safety/inspect", response_model=SafetyInspectionResponse)
async def inspect_safety(
    file: UploadFile = File(...),
    notes: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        mime_type = file.content_type or "image/jpeg"
        result = await analyze_site_safety(image_bytes=content, mime_type=mime_type, notes=notes)
        return result
    except Exception as e:
        logger.error(f"Error in safety inspection: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 2. Crack & Structural Defect Analysis Endpoint (Multimodal Image)
@app.post("/api/v1/crack/analyze", response_model=CrackAnalysisResponse)
async def analyze_crack(
    file: UploadFile = File(...),
    notes: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        mime_type = file.content_type or "image/jpeg"
        result = await analyze_crack_defect(image_bytes=content, mime_type=mime_type, context_notes=notes)
        return result
    except Exception as e:
        logger.error(f"Error in crack analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 3. Real Estate & Construction Cost Valuation Endpoint
@app.post("/api/v1/valuation/calculate", response_model=ValuationResponse)
async def get_valuation(request: ValuationRequest):
    try:
        result = await calculate_valuation(request)
        return result
    except Exception as e:
        logger.error(f"Error in valuation calculation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 4. Construction Project Planning & Scheduling Endpoint
@app.post("/api/v1/planner/generate", response_model=ProjectPlanResponse)
async def plan_project(request: ProjectPlanRequest):
    try:
        result = await generate_project_plan(request)
        return result
    except Exception as e:
        logger.error(f"Error in project planning: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 5. Daily Site Log & Executive Summarizer Endpoint
@app.post("/api/v1/site-log/summarize", response_model=DailyLogResponse)
async def summarize_site_log(request: DailyLogRequest):
    try:
        result = await process_daily_log(request)
        return result
    except Exception as e:
        logger.error(f"Error in site log processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 6. Weather-Aware Advisory Endpoint
@app.post("/api/v1/weather/advisory", response_model=WeatherAdvisoryResponse)
async def get_weather_advisory(request: WeatherAdvisoryRequest):
    try:
        result = await evaluate_weather_risks(request)
        return result
    except Exception as e:
        logger.error(f"Error in weather advisory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 7. Construction Knowledge Assistant Chat Endpoint
@app.post("/api/v1/assistant/chat", response_model=ChatResponse)
async def chat_assistant(request: ChatQuery):
    try:
        result = await answer_construction_query(request)
        return result
    except Exception as e:
        logger.error(f"Error in assistant chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
