from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.agents.context_manager import context_manager
from app.agents.hypothesis_agent import HypothesisAgent
from app.agents.response_planner_agent import ResponsePlannerAgent
from app.agents.critic_agent import CriticAgent
from app.services.reasoning_service import reasoning_service
from app.models.hypothesis import Hypothesis
from app.models.agent_decision import AgentDecision
from app.models.incident import Incident
from app.websocket_handler import manager

class IncidentOrchestrator:
    def __init__(self):
        self.hypothesis_agent = HypothesisAgent()
        self.planner_agent = ResponsePlannerAgent()
        self.critic_agent = CriticAgent()

    async def advance_incident(self, db: AsyncSession, incident_id: UUID):
        """
        Orchestrates the reasoning flow for an incident.
        """
        # 1. Load context
        events = await context_manager.get_incident_context(db, incident_id)
        prev_hypotheses = await context_manager.get_previous_hypotheses(db, incident_id)
        
        context_prompt = reasoning_service.prepare_context_prompt(events, prev_hypotheses)

        # 2. Hypothesis Generation
        hyp_data = await self.hypothesis_agent.process(context_prompt)
        new_hyp = Hypothesis(
            incident_id=incident_id,
            hypothesis_text=hyp_data["hypothesis_text"],
            confidence=hyp_data["confidence"],
            reasoning_summary=hyp_data["reasoning_summary"]
        )
        db.add(new_hyp)
        await db.flush()

        # 3. Response Planning
        plan_data = await self.planner_agent.process(context_prompt + f"\nNew Hypothesis: {new_hyp.hypothesis_text}")
        new_decision = AgentDecision(
            incident_id=incident_id,
            agent_type="ResponsePlanner",
            decision_payload=plan_data,
            reasoning_summary=plan_data.get("reasoning")
        )
        db.add(new_decision)
        await db.flush()

        # 4. Critique
        critique_data = await self.critic_agent.process(
            context_prompt + f"\nProposed Action: {plan_data.get('action')}"
        )
        critic_decision = AgentDecision(
            incident_id=incident_id,
            agent_type="Critic",
            decision_payload=critique_data,
            reasoning_summary=critique_data.get("reasoning")
        )
        db.add(critic_decision)

        # 5. Update incident status
        from sqlalchemy import select
        inc_result = await db.execute(select(Incident).where(Incident.id == incident_id))
        incident = inc_result.scalars().first()
        if incident:
            incident.status = "analyzing"
        
        await db.commit()

        # 6. Broadcast update
        if incident:
            await manager.broadcast(
                str(incident.tenant_id),
                {
                    "type": "INCIDENT_UPDATED",
                    "incident_id": str(incident_id),
                    "status": "analyzing",
                    "latest_hypothesis": hyp_data["hypothesis_text"]
                }
            )

orchestrator = IncidentOrchestrator()
