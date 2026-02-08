import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.orchestrator.incident_orchestrator import orchestrator
from app.schemas.incident import TimelineItem, IncidentAnalyzeRequest, IncidentAnalyzeResponse
from app.services.incident_service import incident_service

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/analyze", response_model=IncidentAnalyzeResponse)
async def analyze_incident(
    request: IncidentAnalyzeRequest
):
    # Generate a random incident_id (uuid4)
    incident_id = str(uuid.uuid4())
    
    # Convert events to dict for orchestrator
    events_dict = [event.model_dump() for event in request.events]
    
    # Call Orchestrator to process incident without DB
    result = await orchestrator.process_incident(incident_id, events_dict)
    
    if result.get("status") == "failed":
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result

@router.get("/{incident_id}/timeline", response_model=List[TimelineItem])
async def get_incident_timeline(incident_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    timeline = await incident_service.get_timeline(db, incident_id)
    return timeline
