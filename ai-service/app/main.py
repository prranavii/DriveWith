from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import os

from app.agents.concierge import concierge_agent
from app.agents.matching_agent import matching_agent
from app.agents.resolution_agent import resolution_agent
from app.agents.safety_agent import safety_agent
from app.agents.driver_assistant import driver_assistant
from app.rag.rag_service import rag_service
from app.vision.inspection_vision import inspection_engine

app = FastAPI(
    title="DriveWith AI Microservice",
    description="Agentic AI, RAG Knowledge Engine & Computer Vision Service for DriveWith Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConciergeRequest(BaseModel):
    message: str
    userId: Optional[str] = "c1010000-0000-0000-0000-000000000001"

class MatchingRequest(BaseModel):
    pickupLat: Optional[float] = 28.5355
    pickupLng: Optional[float] = 77.3910
    transmission: Optional[str] = "AUTOMATIC"
    vehicleType: Optional[str] = "SEDAN"
    isNightTrip: Optional[bool] = False
    isHighwayTrip: Optional[bool] = False
    isEmergencyTrip: Optional[bool] = False

class ResolveRequest(BaseModel):
    bookingId: str
    cancelledDriverId: str

class SafetyRequest(BaseModel):
    tripId: str
    lat: float
    lng: float
    speedKmh: float
    deviationMeters: float

class DriverAssistantRequest(BaseModel):
    driverId: str
    command: str

class RagRequest(BaseModel):
    query: str

class InspectionRequest(BaseModel):
    beforeImages: List[str] = []
    afterImages: List[str] = []

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "DriveWith AI Microservice",
        "provider": os.getenv("LLM_PROVIDER", "mock")
    }

@app.post("/ai/concierge")
def ai_concierge(req: ConciergeRequest):
    return concierge_agent.parse_and_process(req.message, req.userId or "c1010000-0000-0000-0000-000000000001")

@app.post("/ai/chat")
def ai_chat(req: ConciergeRequest):
    return concierge_agent.parse_and_process(req.message, req.userId or "c1010000-0000-0000-0000-000000000001")

@app.post("/ai/match")
def ai_match(req: MatchingRequest):
    return matching_agent.evaluate_and_explain(req.dict())

@app.post("/ai/resolve")
def ai_resolve(req: ResolveRequest):
    return resolution_agent.resolve_cancellation(req.bookingId, req.cancelledDriverId)

@app.post("/ai/safety")
def ai_safety(req: SafetyRequest):
    return safety_agent.analyze_telemetry(req.tripId, req.lat, req.lng, req.speedKmh, req.deviationMeters)

@app.post("/ai/driver-assistant")
def ai_driver_assistant(req: DriverAssistantRequest):
    return driver_assistant.process_command(req.driverId, req.command)

@app.post("/ai/rag/query")
def ai_rag_query(req: RagRequest):
    return rag_service.query(req.query)

@app.post("/ai/inspection")
def ai_inspection(req: InspectionRequest):
    return inspection_engine.compare_inspection_photos(req.beforeImages, req.afterImages)
