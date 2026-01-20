from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.incident import Incident as IncidentModel
from app.schemas.incident import Incident, IncidentCreate, TimelineItem
from app.services.incident_service import incident_service
from app.workers.tasks import analyze_incident_task

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/analyze", response_model=Incident)
async def analyze_incident(incident_in: IncidentCreate, db: AsyncSession = Depends(get_db)):
    db_incident = IncidentModel(**incident_in.model_dump())
    db.add(db_incident)
    await db.commit()
    await db.refresh(db_incident)
    
    # Trigger Celery Task
    analyze_incident_task.delay(str(db_incident.id))
    
    return db_incident

@router.get("/{incident_id}/timeline", response_model=List[TimelineItem])
async def get_incident_timeline(incident_id: UUID, db: AsyncSession = Depends(get_db)):
    timeline = await incident_service.get_timeline(db, incident_id)
    return timeline
