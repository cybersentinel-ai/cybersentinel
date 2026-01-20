from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class HypothesisBase(BaseModel):
    incident_id: UUID
    hypothesis_text: str
    confidence: float
    reasoning_summary: Optional[str] = None

class HypothesisCreate(HypothesisBase):
    pass

class Hypothesis(HypothesisBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AgentDecisionBase(BaseModel):
    incident_id: UUID
    agent_type: str
    decision_payload: Dict[str, Any]
    reasoning_summary: Optional[str] = None

class AgentDecisionCreate(AgentDecisionBase):
    pass

class AgentDecision(AgentDecisionBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AgentActionRequest(BaseModel):
    incident_id: UUID

class AgentReviewRequest(BaseModel):
    incident_id: UUID
    decision_id: UUID
    approved: bool
    comments: Optional[str] = None
