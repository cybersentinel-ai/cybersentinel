from typing import Any, Dict, Optional
import logging
from app.agents.base_agent import BaseAgent
from app.services.gemini_service import GeminiService, gemini_service
from app.models.agent_decision import AgentDecision
from app.db.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

class CriticAgent(BaseAgent):
    def __init__(self, gemini_service_instance: Optional[GeminiService] = None):
        super().__init__(name="Critic Agent", agent_type="Critic")
        self.gemini_service = gemini_service_instance or gemini_service

    async def review(self, incident_id: str, hypothesis: Dict[str, Any], response_plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates and critiques the response plan.
        
        Args:
            incident_id: The ID of the incident
            hypothesis: The hypothesis dictionary
            response_plan: The proposed response plan dictionary
            
        Returns:
            A dictionary containing the critique, approval status, and revisions.
        """
        logger.info(f"Agent {self.name} reviewing response plan for incident {incident_id}")
        
        try:
            # Call Gemini service to critique the decision
            critique = await self.gemini_service.critique_decision(hypothesis, response_plan)
            
            # Handle error from gemini service
            if "error" in critique:
                logger.error(f"Gemini service returned error during critique: {critique['error']}")
            
            # Save critique to database
            await self._save_decision(incident_id, critique)
            
            return critique

        except Exception as e:
            logger.error(f"Unexpected error in CriticAgent.review: {e}")
            return {
                "error": str(e),
                "approved": False,
                "concerns": ["Internal error during critique"],
                "revised_actions": []
            }

    async def _save_decision(self, incident_id: str, critique: Dict[str, Any]):
        """Saves the critique to the agent_decisions table."""
        try:
            # Derive confidence from 0.8 base + adjustment
            adjustment = critique.get("confidence_adjustment", 0.0)
            try:
                confidence = max(0.0, min(1.0, 0.8 + float(adjustment)))
            except (ValueError, TypeError):
                confidence = 0.8
            
            # Create reasoning summary
            approved = critique.get("approved", False)
            concerns = critique.get("concerns", [])
            summary = f"Plan {'approved' if approved else 'rejected'}."
            if concerns:
                summary += f" Concerns: {', '.join(concerns)}"

            async with AsyncSessionLocal() as session:
                async with session.begin():
                    decision = AgentDecision(
                        incident_id=incident_id,
                        agent_type="critic",
                        decision_payload=critique,
                        confidence=confidence,
                        reasoning_summary=summary
                    )
                    session.add(decision)
                # Transaction is committed here automatically
            logger.info(f"Successfully saved critique for incident {incident_id}")
        except Exception as e:
            logger.error(f"Failed to save critique to database for incident {incident_id}: {e}")

    async def process(self, context: str) -> Dict[str, Any]:
        """
        Implements the abstract process method from BaseAgent.
        Maintains backward compatibility.
        """
        prompt = f"Review the proposed response plan and hypotheses for the following context. Provide a critique and either approve or request refinements:\n{context}"
        schema = {
            "approved": "boolean",
            "refinement": "string",
            "reasoning": "string"
        }
        return await self.gemini_service.generate_structured(prompt, schema)
