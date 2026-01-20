from typing import Any, Dict
from app.agents.base_agent import BaseAgent
from app.services.gemini_service import gemini_service

class CriticAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Critic Agent", agent_type="Critic")

    async def process(self, context: str) -> Dict[str, Any]:
        prompt = f"Review the proposed response plan and hypotheses for the following context. Provide a critique and either approve or request refinements:\n{context}"
        schema = {
            "approved": "boolean",
            "refinement": "string",
            "reasoning": "string"
        }
        return await gemini_service.generate_structured(prompt, schema)
