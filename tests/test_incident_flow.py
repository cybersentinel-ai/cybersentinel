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
    # Mocking celery task to avoid needing a running worker for this test
    with patch("app.api.router_incidents.analyze_incident_task.delay") as mock_task:
        inc_res = await client.post("/api/incidents/analyze", json={
            "tenant_id": tenant_id,
            "title": "Suspected Port Scan",
            "description": "Multiple ports scanned from single IP",
            "status": "open"
        })
        assert inc_res.status_code == 200
        incident_id = inc_res.json()["id"]
        mock_task.assert_called_once_with(incident_id)

    # 4. Get Timeline
    timeline_res = await client.get(f"/api/incidents/{incident_id}/timeline")
    assert timeline_res.status_code == 200
    assert isinstance(timeline_res.json(), list)
