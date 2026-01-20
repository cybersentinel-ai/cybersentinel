from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.event import Event
from app.models.hypothesis import Hypothesis
from app.models.agent_decision import AgentDecision

class ContextManager:
    async def get_incident_context(self, db: AsyncSession, incident_id: UUID) -> List[Event]:
        # In a real scenario, this would find events related to the incident
        # For now, let's just return all events for the tenant of this incident
        
        # 1. Get incident to find tenant_id
        from app.models.incident import Incident
        inc_result = await db.execute(select(Incident).where(Incident.id == incident_id))
        incident = inc_result.scalars().first()
        
        if not incident:
            return []
            
        # 2. Get events for tenant
        event_result = await db.execute(
            select(Event).where(Event.tenant_id == incident.tenant_id).order_by(Event.created_at.desc()).limit(50)
        )
        return event_result.scalars().all()

    async def get_previous_hypotheses(self, db: AsyncSession, incident_id: UUID) -> List[Hypothesis]:
        result = await db.execute(
            select(Hypothesis).where(Hypothesis.incident_id == incident_id).order_by(Hypothesis.created_at.asc())
        )
        return result.scalars().all()

    async def get_previous_decisions(self, db: AsyncSession, incident_id: UUID) -> List[AgentDecision]:
        result = await db.execute(
            select(AgentDecision).where(AgentDecision.incident_id == incident_id).order_by(AgentDecision.created_at.asc())
        )
        return result.scalars().all()

context_manager = ContextManager()
