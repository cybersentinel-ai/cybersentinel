from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.event import Event as EventModel
from app.schemas.event import Event, EventCreate

router = APIRouter(prefix="/logs", tags=["logs"])

@router.post("/ingest", response_model=Event)
async def ingest_log(event_in: EventCreate, db: AsyncSession = Depends(get_db)):
    # Basic filtering logic could go here
    db_event = EventModel(**event_in.model_dump())
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event
