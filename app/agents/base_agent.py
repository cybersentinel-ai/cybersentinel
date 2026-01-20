from typing import Any, Dict
from abc import ABC, abstractmethod

class BaseAgent(ABC):
    def __init__(self, name: str, agent_type: str):
        self.name = name
        self.agent_type = agent_type

    @abstractmethod
    async def process(self, context: str) -> Dict[str, Any]:
        pass
