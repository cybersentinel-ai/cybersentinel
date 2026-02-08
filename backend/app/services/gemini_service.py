import os
import json
import logging
import asyncio
from typing import Any, Dict, List, Optional
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
from google.api_core import exceptions

from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from enum import Enum

class ThreatType(str, Enum):
    BRUTE_FORCE = "brute_force"
    MALWARE = "malware"
    PHISHING = "phishing"
    DATA_EXFILTRATION = "data_exfiltration"
    DOS = "dos"
    RECONNAISSANCE = "reconnaissance"
    PRIVILEGE_ESCALATION = "privilege_escalation"
    OTHER = "other"

class Priority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Hypothesis(BaseModel):
    hypothesis_text: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: List[str]
    threat_type: ThreatType

class HypothesisResponse(BaseModel):
    hypotheses: List[Hypothesis]

class ResponsePlan(BaseModel):
    actions: List[str]
    priority: Priority
    estimated_impact: str
    false_positive_risk: float = Field(ge=0.0, le=1.0)

class CritiqueResponse(BaseModel):
    approved: bool
    confidence_adjustment: float = Field(ge=-0.3, le=0.3)
    concerns: List[str]
    revised_actions: Optional[List[str]] = None

class AnalysisResult(BaseModel):
    threat_type: str
    severity: str
    description: str
    recommended_actions: List[str]
    confidence: float

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            
        self.model_name = "gemini-1.5-pro"
        self.max_retries = 3
        self.timeout = 30
        self._model = None

    @property
    def model(self):
        if self._model is None:
            if not self.api_key:
                logger.error("GEMINI_API_KEY is required but not set.")
                raise ValueError("GEMINI_API_KEY is required but not set.")
            self._model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "response_mime_type": "application/json",
                }
            )
        return self._model

    async def _generate_content(self, prompt: str) -> str:
        """Helper for API calls with retries and timeout."""
        last_exception = None
        for attempt in range(self.max_retries):
            try:
                logger.info(f"Calling Gemini API (attempt {attempt + 1})")
                logger.debug(f"Prompt: {prompt}")
                
                # Using generate_content_async for asynchronous call
                response = await asyncio.wait_for(
                    self.model.generate_content_async(prompt),
                    timeout=self.timeout
                )
                
                response_text = response.text
                logger.info(f"Received response from Gemini API: {response_text[:200]}...")
                return response_text
                
            except (exceptions.InternalServerError, exceptions.ServiceUnavailable, exceptions.DeadlineExceeded) as e:
                last_exception = e
                wait_time = 2 ** attempt
                logger.warning(f"Gemini API error (attempt {attempt + 1}): {e}. Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
            except asyncio.TimeoutError:
                last_exception = Exception(f"Timeout of {self.timeout}s exceeded during Gemini API call")
                logger.warning(f"Gemini API timeout (attempt {attempt + 1}). Retrying...")
            except exceptions.ResourceExhausted as e:
                last_exception = e
                wait_time = 5 * (attempt + 1)
                logger.warning(f"Gemini API rate limit exceeded: {e}. Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
            except Exception as e:
                logger.error(f"Unexpected error during Gemini API call: {e}")
                raise
        
        raise last_exception or Exception("Failed to generate content after retries")

    async def generate_hypothesis(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze security events and generate 3 competing hypotheses.
        """
        events = incident_data.get("events", [])
        context = incident_data.get("context", "")
        
        prompt = (
            "You are a cybersecurity expert. Analyze these security events and generate 3 competing hypotheses about what's happening. "
            "For each hypothesis, provide:\n"
            "- hypothesis_text: Brief description\n"
            "- confidence: Float 0-1\n"
            "- evidence: List of supporting indicators\n"
            "- threat_type: (brute_force|malware|phishing|data_exfiltration|dos|reconnaissance|privilege_escalation|other)\n\n"
            "Return valid JSON with this structure:\n"
            "{\n"
            '  "hypotheses": [\n'
            '    {"hypothesis_text": str, "confidence": float, "evidence": [str], "threat_type": str}\n'
            "  ]\n"
            "}\n\n"
            f"Security Events: {json.dumps(events)}\n"
            f"Context: {context}"
        )
        
        try:
            response_text = await self._generate_content(prompt)
            data = json.loads(response_text)
            validated = HypothesisResponse(**data)
            return validated.model_dump()
        except (json.JSONDecodeError, ValidationError) as e:
            logger.error(f"Malformed response in generate_hypothesis: {e}")
            return {"error": "Malformed response from AI", "details": str(e), "hypotheses": []}
        except Exception as e:
            logger.error(f"Error in generate_hypothesis: {e}")
            return {"error": str(e), "hypotheses": []}

    async def plan_response(self, hypothesis: Dict[str, Any], incident_context: Dict[str, Any], critique: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Given a hypothesis and incident context, plan a response.
        If a critique is provided, refine the plan based on feedback.
        """
        prompt = (
            "Given this security threat hypothesis, plan a response. Provide:\n"
            "- actions: List of containment actions (e.g., 'Block IP', 'Isolate host', 'Reset credentials')\n"
            "- priority: (critical|high|medium|low)\n"
            "- estimated_impact: Brief description\n"
            "- false_positive_risk: Float 0-1\n\n"
        )
        
        if critique:
            prompt += (
                "IMPORTANT: A previous plan was rejected. Please address these concerns and incorporate suggested revisions:\n"
                f"Concerns: {json.dumps(critique.get('concerns', []))}\n"
                f"Suggested Revisions: {json.dumps(critique.get('revised_actions', []))}\n\n"
            )
            
        prompt += (
            "Return JSON:\n"
            "{\n"
            '  "actions": [str],\n'
            '  "priority": str,\n'
            '  "estimated_impact": str,\n'
            '  "false_positive_risk": float\n'
            "}\n\n"
            f"Hypothesis: {json.dumps(hypothesis)}\n"
            f"Incident Context: {json.dumps(incident_context)}"
        )
        
        try:
            response_text = await self._generate_content(prompt)
            data = json.loads(response_text)
            validated = ResponsePlan(**data)
            return validated.model_dump()
        except (json.JSONDecodeError, ValidationError) as e:
            logger.error(f"Malformed response in plan_response: {e}")
            return {"error": "Malformed response from AI", "details": str(e), "actions": [], "priority": "medium"}
        except Exception as e:
            logger.error(f"Error in plan_response: {e}")
            return {"error": str(e), "actions": [], "priority": "medium"}

    async def critique_decision(self, hypothesis: Dict[str, Any], response_plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        Critically evaluate a proposed incident response.
        """
        prompt = (
            "You are a security analyst reviewing a proposed incident response. Critically evaluate:\n"
            "- Is the hypothesis well-supported by evidence?\n"
            "- Are the proposed actions appropriate?\n"
            "- What risks or false positives might exist?\n"
            "- Should the plan be revised?\n\n"
            "Return JSON:\n"
            "{\n"
            '  "approved": bool,\n'
            '  "confidence_adjustment": float (-0.3 to +0.3),\n'
            '  "concerns": [str],\n'
            '  "revised_actions": [str] (if not approved)\n'
            "}\n\n"
            f"Hypothesis: {json.dumps(hypothesis)}\n"
            f"Proposed Response Plan: {json.dumps(response_plan)}"
        )
        
        try:
            response_text = await self._generate_content(prompt)
            data = json.loads(response_text)
            validated = CritiqueResponse(**data)
            return validated.model_dump()
        except (json.JSONDecodeError, ValidationError) as e:
            logger.error(f"Malformed response in critique_decision: {e}")
            return {"error": "Malformed response from AI", "details": str(e), "approved": False, "concerns": ["Parsing error"]}
        except Exception as e:
            logger.error(f"Error in critique_decision: {e}")
            return {"error": str(e), "approved": False, "concerns": ["Internal error"]}

    async def analyze_events(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze security events and provide a concise analysis.
        """
        prompt = (
            "You are a cybersecurity expert. Analyze these security events and provide a concise analysis. "
            "Return JSON with this structure:\n"
            "{\n"
            '  "threat_type": str (e.g., brute_force, malware, phishing, etc.),\n'
            '  "severity": str (critical, high, medium, low),\n'
            '  "description": str,\n'
            '  "recommended_actions": [str],\n'
            '  "confidence": float (0-1)\n'
            "}\n\n"
            f"Security Events: {json.dumps(events)}"
        )
        
        try:
            response_text = await self._generate_content(prompt)
            data = json.loads(response_text)
            validated = AnalysisResult(**data)
            return validated.model_dump()
        except (json.JSONDecodeError, ValidationError) as e:
            logger.error(f"Malformed response in analyze_events: {e}")
            return {
                "threat_type": "unknown",
                "severity": "medium",
                "description": f"Malformed response from AI: {str(e)}",
                "recommended_actions": ["Investigate manually"],
                "confidence": 0.0
            }
        except Exception as e:
            logger.error(f"Error in analyze_events: {e}")
            return {
                "threat_type": "unknown",
                "severity": "medium",
                "description": f"Error during analysis: {str(e)}",
                "recommended_actions": ["Investigate manually"],
                "confidence": 0.0
            }

    async def generate_structured(self, prompt: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generic method for structured generation, maintained for backward compatibility.
        """
        full_prompt = f"{prompt}\n\nReturn valid JSON matching this schema: {json.dumps(schema)}"
        try:
            response_text = await self._generate_content(full_prompt)
            return json.loads(response_text)
        except Exception as e:
            logger.error(f"Error in generate_structured: {e}")
            return {"error": str(e)}

# Export a default instance
gemini_service = GeminiService()
