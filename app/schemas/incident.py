from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class IncidentBase(BaseModel):
    tenant_id: UUID
    title: str
    description: Optional[str] = None
    status: str = "open"

class IncidentCreate(IncidentBase):
    pass

class Incident(IncidentBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class TimelineItem(BaseModel):
    id: UUID
    type: str  # 'hypothesis' or 'decision'
    timestamp: datetime
    agent_type: Optional[str] = None
    content: str
    metadata: Optional[dict] = None
