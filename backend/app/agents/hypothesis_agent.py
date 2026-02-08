from typing import List, Dict, Any, Optional
import logging
import uuid
from app.services.gemini_service import GeminiService, gemini_service
from app.models.hypothesis import Hypothesis
from app.db.database import AsyncSessionLocal
from app.agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)

class HypothesisAgent(BaseAgent):
    def __init__(self, gemini_service_instance: Optional[GeminiService] = None):
        super().__init__(name="Hypothesis Agent", agent_type="Hypothesis")
        self.gemini_service = gemini_service_instance or gemini_service

    async def analyze(self, incident_id: str, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generates competing threat hypotheses from security events.
        
        Args:
            incident_id: The ID of the incident to analyze (UUID string)
            events: A list of security events related to the incident
            
        Returns:
            A list of hypothesis dictionaries with confidence scores
        """
        logger.info(f"Agent {self.name} analyzing incident {incident_id} with {len(events)} events")
        
        try:
            # Prepare incident data for Gemini
            incident_data = {
                "events": events,
                "context": f"Analyzing {len(events)} security events for incident {incident_id}"
            }
            
            # Call Gemini service
            response = await self.gemini_service.generate_hypothesis(incident_data)
            
            # Extract hypotheses from response
            hypotheses_data = response.get("hypotheses", [])
            
            # Error handling: If Gemini fails or returns no hypotheses, return fallback
            if not hypotheses_data or "error" in response:
                if "error" in response:
                    logger.error(f"Gemini service returned error: {response['error']}")
                return self._get_fallback_hypothesis(incident_id)

            # Save hypotheses to database
            await self._save_hypotheses(incident_id, hypotheses_data)
            
            return hypotheses_data

        except Exception as e:
            logger.error(f"Unexpected error in HypothesisAgent.analyze: {e}")
            return self._get_fallback_hypothesis(incident_id)

    async def _save_hypotheses(self, incident_id: str, hypotheses_data: List[Dict[str, Any]]):
        """Saves generated hypotheses to the database."""
        try:
            async with AsyncSessionLocal() as session:
                async with session.begin():
                    for h_data in hypotheses_data:
                        hypothesis = Hypothesis(
                            incident_id=incident_id,
                            hypothesis_text=h_data.get("hypothesis_text"),
                            confidence=h_data.get("confidence", 0.0),
                            evidence=h_data.get("evidence", []),
                            threat_type=h_data.get("threat_type", "other")
                        )
                        session.add(hypothesis)
                # Transaction is committed here automatically
            logger.info(f"Successfully saved {len(hypotheses_data)} hypotheses for incident {incident_id}")
        except Exception as e:
            logger.error(f"Failed to save hypotheses to database for incident {incident_id}: {e}")

    def _get_fallback_hypothesis(self, incident_id: str) -> List[Dict[str, Any]]:
        """Returns a low-confidence fallback hypothesis when analysis fails."""
        return [{
            "hypothesis_text": "Uncertain threat activity detected. Manual investigation required.",
            "confidence": 0.1,
            "evidence": ["Automated analysis failed or returned no results"],
            "threat_type": "other"
        }]

    async def process(self, context: str) -> Dict[str, Any]:
        """
        Implements the abstract process method from BaseAgent.
        """
        prompt = f"Analyze the following security context and generate a hypothesis about the incident:\n{context}"
        schema = {
            "hypothesis_text": "string",
            "confidence": "float",
            "reasoning_summary": "string"
        }
        return await self.gemini_service.generate_structured(prompt, schema)
