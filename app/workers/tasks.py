import asyncio
from uuid import UUID
from app.workers.celery_app import celery_app
from app.db.database import AsyncSessionLocal
from app.orchestrator.incident_orchestrator import orchestrator

@celery_app.task(name="tasks.analyze_incident_task")
def analyze_incident_task(incident_id_str: str):
    """
    Celery task to trigger incident analysis.
    Uses a synchronous wrapper to call the async orchestrator.
    """
    incident_id = UUID(incident_id_str)
    
    loop = asyncio.get_event_loop()
    if loop.is_running():
        # This shouldn't happen in a standard Celery worker but good to have
        asyncio.run_coroutine_threadsafe(run_analysis(incident_id), loop)
    else:
        loop.run_until_complete(run_analysis(incident_id))

async def run_analysis(incident_id: UUID):
    async with AsyncSessionLocal() as db:
        await orchestrator.advance_incident(db, incident_id)
