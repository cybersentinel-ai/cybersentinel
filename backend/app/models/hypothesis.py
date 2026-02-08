import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base

class Hypothesis(Base):
    __tablename__ = "incident_hypotheses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    hypothesis_text = Column(String, nullable=False)
    confidence = Column(Float, default=0.0)
    evidence = Column(JSON)
    threat_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
