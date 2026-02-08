from typing import List, Dict, Any, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.incident import Incident
from app.models.hypothesis import Hypothesis
from app.models.agent_decision import AgentDecision
from app.schemas.incident import TimelineItem

class IncidentService:
    async def get_incident(self, db: AsyncSession, incident_id: UUID) -> Optional[Incident]:
        result = await db.execute(select(Incident).where(Incident.id == incident_id))
        return result.scalars().first()

    async def get_timeline(self, db: AsyncSession, incident_id: UUID) -> List[TimelineItem]:
        # Fetch hypotheses
        hyp_result = await db.execute(
            select(Hypothesis).where(Hypothesis.incident_id == incident_id)
        )
        hypotheses = hyp_result.scalars().all()

        # Fetch agent decisions
        dec_result = await db.execute(
            select(AgentDecision).where(AgentDecision.incident_id == incident_id)
        )
        decisions = dec_result.scalars().all()

        timeline = []

        for h in hypotheses:
            timeline.append(TimelineItem(
                id=h.id,
                type="hypothesis",
                timestamp=h.created_at,
                content=h.hypothesis_text,
                metadata={"confidence": h.confidence, "threat_type": h.threat_type}
            ))

        for d in decisions:
            timeline.append(TimelineItem(
                id=d.id,
                type="decision",
                timestamp=d.created_at,
                agent_type=d.agent_type,
                content=f"Decision by {d.agent_type}",
                metadata={"payload": d.decision_payload, "reasoning": d.reasoning_summary}
            ))

        # Sort by timestamp
        timeline.sort(key=lambda x: x.timestamp)
        return timeline

incident_service = IncidentService()
