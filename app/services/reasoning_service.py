from typing import List, Dict, Any
from app.models.event import Event
from app.models.hypothesis import Hypothesis

class ReasoningService:
    """
    Utilities for reasoning and context preparation.
    """
    def prepare_context_prompt(self, events: List[Event], hypotheses: List[Hypothesis]) -> str:
        prompt = "System Context:\n"
        prompt += f"Number of events: {len(events)}\n"
        for i, event in enumerate(events):
            prompt += f"Event {i}: {event.event_type} from {event.source}\n"
        
        if hypotheses:
            prompt += "\nPrevious Hypotheses:\n"
            for h in hypotheses:
                prompt += f"- {h.hypothesis_text} (Confidence: {h.confidence})\n"
        
        return prompt

reasoning_service = ReasoningService()
