import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api import router_tenants, router_logs, router_incidents, router_agents
from app.websocket_handler import manager
from app.config import settings
from app.db.database import Base, engine

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME, "version": settings.VERSION}

# WebSocket route
@app.websocket("/ws/incidents/{tenant_id}")
async def websocket_endpoint(websocket: WebSocket, tenant_id: str):
    await manager.connect(websocket, tenant_id)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, tenant_id)

# Routers
app.include_router(router_tenants.router, prefix=settings.API_V1_STR)
app.include_router(router_logs.router, prefix=settings.API_V1_STR)
app.include_router(router_incidents.router, prefix=settings.API_V1_STR)
app.include_router(router_agents.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database tables created/verified successfully")
    except Exception as e:
        logger.warning(f"⚠️ Database initialization failed: {e}")
        logger.info("Application will continue - database will connect on first request")
