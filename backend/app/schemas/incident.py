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

class EventItem(BaseModel):
    timestamp: str
    log_message: str
    source: str
    severity: str

class IncidentAnalyzeRequest(BaseModel):
    tenant_id: UUID
    events: List[EventItem]

class AnalysisResult(BaseModel):
    threat_type: str
    severity: str
    description: str
    recommended_actions: List[str]
    confidence: float

class IncidentAnalyzeResponse(BaseModel):
    incident_id: str
    status: str
    analysis: AnalysisResult

class TimelineItem(BaseModel):
    id: UUID
    type: str  # 'hypothesis' or 'decision'
    timestamp: datetime
    agent_type: Optional[str] = None
    content: str
    metadata: Optional[dict] = None
