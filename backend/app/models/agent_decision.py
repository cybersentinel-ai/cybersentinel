import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base

class AgentDecision(Base):
    __tablename__ = "agent_decisions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    agent_type = Column(String, nullable=False)  # Hypothesis, ResponsePlanner, Critic
    decision_payload = Column(JSON, nullable=False)
    confidence = Column(Float, default=1.0)
    reasoning_summary = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
