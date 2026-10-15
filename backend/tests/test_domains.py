from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_headers(role: str = "ADMIN") -> dict[str, str]:
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@enterprise.workforce", "password": "password"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_domain_departments_endpoint():
    headers = get_auth_headers()
    response = client.get("/api/v1/departments", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) > 0


def test_domain_skills_endpoint():
    headers = get_auth_headers()
    response = client.get("/api/v1/skills", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) > 0


def test_domain_skills_gaps_endpoint():
    headers = get_auth_headers()
    response = client.get("/api/v1/skills/gaps", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "gaps" in data


def test_domain_predictions_metrics():
    headers = get_auth_headers()
    response = client.get("/api/v1/predictions/metrics", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "roc_auc" in data
    assert "confusion_matrix" in data


def test_domain_alerts_lifecycle():
    headers = get_auth_headers()
    list_resp = client.get("/api/v1/alerts", headers=headers)
    assert list_resp.status_code == 200
    alerts = list_resp.json()["alerts"]
    assert len(alerts) > 0

    first_id = alerts[0]["id"]
    read_resp = client.post(f"/api/v1/alerts/{first_id}/read", headers=headers)
    assert read_resp.status_code == 200
    assert read_resp.json()["success"] is True


def test_domain_reports_export_csv():
    headers = get_auth_headers()
    response = client.get("/api/v1/reports/export/employees/csv", headers=headers)
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "EmployeeNumber,FirstName" in response.text


def test_domain_scenarios_what_if():
    headers = get_auth_headers()
    payload = {
        "employee_id": "EMP-104",
        "satisfaction_score": 85.0,
        "overtime_hours": 5,
        "compa_ratio": 1.05
    }
    response = client.post("/api/v1/scenarios/simulate/what-if", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "simulated_risk" in data
    assert "risk_reduction_points" in data
