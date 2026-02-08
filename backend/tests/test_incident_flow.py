import pytest
from unittest.mock import patch

@pytest.mark.asyncio
async def test_incident_flow(client):
    # 1. Create Tenant
    tenant_res = await client.post("/api/tenants/", json={"name": "Test Corp"})
    assert tenant_res.status_code == 200
    tenant_id = tenant_res.json()["id"]

    # 2. Ingest Log
    log_res = await client.post("/api/logs/ingest", json={
        "tenant_id": tenant_id,
        "source": "firewall",
        "event_type": "port_scan",
        "payload": {"ip": "1.2.3.4", "ports": [80, 443]}
    })
    assert log_res.status_code == 200

    # 3. Trigger Incident Analysis
    # Mocking background task to avoid needing actual analysis during this test
    with patch("app.api.router_incidents.IncidentOrchestrator") as mock_orch_class:
        mock_orch = mock_orch_class.return_value
        # Use AsyncMock for async method
        from unittest.mock import AsyncMock
        mock_orch.process_incident = AsyncMock(return_value={
            "incident_id": "test-id",
            "status": "completed",
            "hypotheses": [],
            "response_plan": {},
            "critic_review": {},
            "final_decision": {}
        })
        
        inc_res = await client.post("/api/incidents/analyze", json={
            "tenant_id": tenant_id,
            "events": [
                {"timestamp": "2024-05-20T10:00:00Z", "log_message": "Failed login", "source": "auth", "severity": "high"}
            ]
        })
        assert inc_res.status_code == 200
        data = inc_res.json()
        assert data["status"] == "completed"
        incident_id = data["incident_id"]
        assert "hypotheses" in data
        assert "response_plan" in data
        assert "critic_review" in data
        assert "final_decision" in data

    # 4. Get Timeline
    timeline_res = await client.get(f"/api/incidents/{incident_id}/timeline")
    assert timeline_res.status_code == 200
    assert isinstance(timeline_res.json(), list)
