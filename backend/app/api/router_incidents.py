import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.incident import TimelineItem, IncidentAnalyzeRequest, IncidentAnalyzeResponse
from app.services.incident_service import incident_service
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/analyze", response_model=IncidentAnalyzeResponse)
async def analyze_incident(
    request: IncidentAnalyzeRequest
):
    # Generate a random incident_id (uuid4)
    incident_id = str(uuid.uuid4())
    
    # Call GeminiService directly to analyze the events
    events_dict = [event.model_dump() for event in request.events]
    analysis = await gemini_service.analyze_events(events_dict)
    
    return {
        "incident_id": incident_id,
        "status": "completed",
        "analysis": analysis
    }

@router.get("/{incident_id}/timeline", response_model=List[TimelineItem])
async def get_incident_timeline(incident_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    timeline = await incident_service.get_timeline(db, incident_id)
    return timeline
