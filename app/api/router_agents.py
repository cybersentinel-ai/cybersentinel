from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.agent import AgentActionRequest, AgentReviewRequest
from app.orchestrator.incident_orchestrator import orchestrator

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/advance")
async def advance_agents(request: AgentActionRequest, db: AsyncSession = Depends(get_db)):
    """
    Manually trigger agent reasoning for an incident.
    """
    await orchestrator.advance_incident(db, request.incident_id)
    return {"status": "success", "message": "Incident analysis advanced"}

@router.post("/review")
async def review_agent_decision(request: AgentReviewRequest, db: AsyncSession = Depends(get_db)):
    """
    Stub for human-in-the-loop review of agent decisions.
    """
    return {"status": "success", "message": "Review recorded"}
