from typing import Any, Dict
from app.agents.base_agent import BaseAgent
from app.services.gemini_service import gemini_service

class HypothesisAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Hypothesis Agent", agent_type="Hypothesis")

    async def process(self, context: str) -> Dict[str, Any]:
        prompt = f"Analyze the following security context and generate a hypothesis about the incident:\n{context}"
        schema = {
            "hypothesis_text": "string",
            "confidence": "float",
            "reasoning_summary": "string"
        }
        return await gemini_service.generate_structured(prompt, schema)
