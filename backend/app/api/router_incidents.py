from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.incident import Incident as IncidentModel
from app.schemas.incident import Incident, IncidentCreate, TimelineItem, IncidentAnalyzeRequest, IncidentAnalyzeResponse
from app.services.incident_service import incident_service
from app.orchestrator.incident_orchestrator import IncidentOrchestrator

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/analyze", response_model=IncidentAnalyzeResponse)
async def analyze_incident(
    request: IncidentAnalyzeRequest, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # Create incident in database
    db_incident = IncidentModel(
        tenant_id=request.tenant_id,
        title=f"Automated Analysis: {request.tenant_id}",
        status="analyzing"
    )
    db.add(db_incident)
    await db.commit()
    await db.refresh(db_incident)
    
    # Call orchestrator (directly for now, in background)
    orchestrator = IncidentOrchestrator()
    events_dict = [event.model_dump() for event in request.events]
    
    # We use background_tasks to not block the response
    background_tasks.add_task(orchestrator.process_incident, str(db_incident.id), events_dict)
    
    return {
        "incident_id": str(db_incident.id),
        "status": "processing",
        "message": "Incident analysis started"
    }

@router.get("/{incident_id}/timeline", response_model=List[TimelineItem])
async def get_incident_timeline(incident_id: UUID, db: AsyncSession = Depends(get_db)):
    timeline = await incident_service.get_timeline(db, incident_id)
    return timeline
