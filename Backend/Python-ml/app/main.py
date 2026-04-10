# app/main.py
# FastAPI application — India Post ML Scoring Service
# Spring Boot calls this service after every village upload.

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from datetime import datetime

from app.models import VillageData, RecommendationResponse, HealthResponse
from app.scorer import score_village


# ── Configure logging ─────────────────────────────────────────
# This prints useful information to the terminal when requests come in
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)


# ── Create FastAPI app ────────────────────────────────────────
app = FastAPI(
    title="India Post ML Scoring Service",
    description="Scores financial scheme recommendations for villages",
    version="1.0.0",
)


# ── CORS middleware ───────────────────────────────────────────
# Allows Spring Boot (port 8080) to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ── Global error handler ──────────────────────────────────────
# If any unexpected error happens, return clean JSON instead of crash
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )


# ── ENDPOINT 1: Health check ──────────────────────────────────
# Spring Boot calls this on startup to verify Python is running.
# Returns 200 OK if Python is alive.
@app.get("/health", response_model=HealthResponse)
async def health_check():
    logger.info("Health check called")
    return HealthResponse(
        status="ok",
        service="India Post ML Scoring Service",
        version="1.0.0"
    )


# ── ENDPOINT 2: Recommend ─────────────────────────────────────
# The main endpoint. Spring Boot POSTs village data here.
# Returns ranked list of all 7 schemes.
@app.post("/recommend", response_model=RecommendationResponse)
async def recommend(data: VillageData):
    """
    Receive village demographics from Spring Boot.
    Score all 7 schemes. Return ranked list.
    """
    logger.info(
        f"Scoring village: {data.villageId} | "
        f"pop: {data.popTotal} | "
        f"month: {data.currentMonth} | "
        f"crop: {data.cropType}"
    )

    try:
        # Run the scoring formula
        schemes = score_village(data)

        logger.info(
            f"Village {data.villageId} scored | "
            f"top scheme: {schemes[0].code} ({schemes[0].score})"
        )

        return RecommendationResponse(
            villageId=data.villageId,
            month=data.currentMonth,
            schemes=schemes
        )

    except Exception as e:
        logger.error(f"Scoring failed for village {data.villageId}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scoring failed: {str(e)}"
        )
