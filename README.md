# CyberSentinel Backend

Autonomous Incident Reasoning System (Multi-Agent).

## Tech Stack
- **FastAPI**: API Framework
- **PostgreSQL**: Primary Database
- **SQLAlchemy 2.0**: ORM (Async)
- **Redis**: Task Broker & Cache
- **Celery**: Background Workers
- **Pydantic v2**: Data Validation
- **Docker**: Containerization

## Project Structure
- `app/api`: REST Endpoints & WebSocket handlers
- `app/orchestrator`: Agent coordination logic
- `app/agents`: Specialized reasoning agents
- `app/models`: SQLAlchemy database models
- `app/schemas`: Pydantic data models
- `app/workers`: Celery task definitions

## Quick Start (Docker)

1. Clone the repository.
2. Navigate to the `backend` directory.
3. Build and start the containers:
   ```bash
   docker compose up --build
   ```
4. Access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

## Running Tests

To run the test suite:
```bash
pip install -r requirements-dev.txt
pytest
```
(Note: Ensure you have a test database or appropriate environment variables set if running locally outside Docker).

## Core Endpoints
- `POST /api/tenants`: Create a new tenant.
- `POST /api/logs/ingest`: Ingest security logs.
- `POST /api/incidents/analyze`: Trigger autonomous analysis.
- `GET /api/incidents/{incident_id}/timeline`: Retrieve incident reasoning timeline.
- `WS /ws/incidents/{tenant_id}`: Real-time incident updates.
