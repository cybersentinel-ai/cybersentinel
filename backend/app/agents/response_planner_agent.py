from typing import Any, Dict
from app.agents.base_agent import BaseAgent
from app.services.gemini_service import gemini_service

class ResponsePlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Response Planner Agent", agent_type="ResponsePlanner")

    async def process(self, context: str) -> Dict[str, Any]:
        prompt = f"Based on the following incident context and hypotheses, propose a response plan:\n{context}"
        schema = {
            "action": "string",
            "target": "string",
            "priority": "string",
            "reasoning": "string"
        }
        return await gemini_service.generate_structured(prompt, schema)
