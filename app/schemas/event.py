from typing import Dict, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class EventBase(BaseModel):
    tenant_id: UUID
    source: str
    event_type: str
    payload: Dict[str, Any]

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
