from typing import Any, Dict, Optional
import logging
from app.agents.base_agent import BaseAgent
from app.services.gemini_service import GeminiService, gemini_service
from app.models.agent_decision import AgentDecision
from app.db.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

class ResponsePlannerAgent(BaseAgent):
    def __init__(self, gemini_service_instance: Optional[GeminiService] = None):
        super().__init__(name="Response Planner Agent", agent_type="ResponsePlanner")
        self.gemini_service = gemini_service_instance or gemini_service

    async def plan(self, incident_id: str, top_hypothesis: Dict[str, Any], critique: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Takes incident ID and the highest-confidence hypothesis,
        calls gemini_service.plan_response(), saves to database, and returns the plan.
        
        Args:
            incident_id: The ID of the incident (UUID string or UUID)
            top_hypothesis: The highest-confidence hypothesis dictionary
            critique: Optional critique feedback from CriticAgent
            
        Returns:
            A dictionary containing the response plan
        """
        logger.info(f"Agent {self.name} planning response for incident {incident_id}")
        
        try:
            # Prepare incident context
            incident_context = {
                "incident_id": str(incident_id),
                "context": f"Planning response for incident {incident_id} based on top hypothesis"
            }
            
            # Call Gemini service
            response_plan = await self.gemini_service.plan_response(top_hypothesis, incident_context, critique=critique)
            
            # Handle error from gemini service
            if "error" in response_plan:
                logger.error(f"Gemini service returned error during planning: {response_plan['error']}")
                # We still return the plan (which might contain error info and default values)
            
            # Save plan to database
            await self._save_decision(incident_id, response_plan)
            
            return response_plan

        except Exception as e:
            logger.error(f"Unexpected error in ResponsePlannerAgent.plan: {e}")
            return {
                "error": str(e),
                "actions": [],
                "priority": "medium",
                "estimated_impact": "Error during plan generation",
                "false_positive_risk": 1.0
            }

    async def _save_decision(self, incident_id: str, response_plan: Dict[str, Any]):
        """Saves the response plan to the agent_decisions table."""
        try:
            # Derive confidence from 1 - false_positive_risk if available
            fp_risk = response_plan.get("false_positive_risk", 0.0)
            try:
                confidence = max(0.0, min(1.0, 1.0 - float(fp_risk)))
            except (ValueError, TypeError):
                confidence = 1.0
            
            async with AsyncSessionLocal() as session:
                async with session.begin():
                    decision = AgentDecision(
                        incident_id=incident_id,
                        agent_type="response_planner",
                        decision_payload=response_plan,
                        confidence=confidence,
                        reasoning_summary=response_plan.get("estimated_impact", "Generated response plan")
                    )
                    session.add(decision)
                # Transaction is committed here automatically
            logger.info(f"Successfully saved response plan for incident {incident_id}")
        except Exception as e:
            logger.error(f"Failed to save response plan to database for incident {incident_id}: {e}")

    async def process(self, context: str) -> Dict[str, Any]:
        """
        Implements the abstract process method from BaseAgent.
        Maintains backward compatibility.
        """
        prompt = f"Based on the following incident context and hypotheses, propose a response plan:\n{context}"
        schema = {
            "action": "string",
            "target": "string",
            "priority": "string",
            "reasoning": "string"
        }
        return await self.gemini_service.generate_structured(prompt, schema)
