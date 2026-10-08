from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_workforce_summary_endpoint() -> None:
    response = client.get("/api/v1/workforce/summary")
    assert response.status_code == 200
    payload = response.json()
    assert payload["totalEmployees"] >= 50
    assert "averageAttritionRisk" in payload
    assert "retentionOpportunityValue" in payload
    assert isinstance(payload["departmentRisks"], list)
    assert len(payload["departmentRisks"]) >= 4
    assert isinstance(payload["riskDistribution"], list)


def test_workforce_employee_list_endpoint() -> None:
    response = client.get("/api/v1/workforce/employees?page=1&pageSize=10")
    assert response.status_code == 200
    payload = response.json()
    assert payload["page"] == 1
    assert payload["pageSize"] == 10
    assert payload["total"] >= 50
    assert len(payload["data"]) == 10
    first = payload["data"][0]
    assert "employeeNumber" in first
    assert "attritionRisk" in first
    assert "riskTier" in first


def test_workforce_employee_detail_marcus_vance() -> None:
    response = client.get("/api/v1/workforce/employees/EMP-104")
    assert response.status_code == 200
    payload = response.json()
    assert payload["employeeNumber"] == "EMP-104"
    assert payload["firstName"] == "Marcus"
    assert payload["riskTier"] in ["High", "Critical"]
    assert len(payload["contributingFactors"]) >= 3
    assert len(payload["skills"]) >= 3
    assert isinstance(payload["historicalRiskTrend"], list)


def test_workforce_what_if_simulation_endpoint() -> None:
    sim_request = {
        "employee_id": "EMP-104",
        "satisfaction_score": 85.0,
        "engagement_score": 85.0,
        "monthly_hours": 168,
        "overtime_hours": 5,
        "compa_ratio": 1.05,
    }
    response = client.post("/api/v1/workforce/attrition/simulate", json=sim_request)
    assert response.status_code == 200
    payload = response.json()
    assert "original_risk" in payload
    assert "simulated_risk" in payload
    assert "risk_reduction_points" in payload
    assert payload["risk_reduction_points"] > 20.0  # Significant reduction!


def test_workforce_skill_gap_endpoint() -> None:
    response = client.get("/api/v1/workforce/skills/gaps")
    assert response.status_code == 200
    payload = response.json()
    assert payload["totalGapsIdentified"] >= 1
    assert isinstance(payload["gaps"], list)
    first_gap = payload["gaps"][0]
    assert "skill" in first_gap
    assert "requiredHeadcount" in first_gap
    assert "gapPercent" in first_gap


def test_workforce_talent_match_endpoint() -> None:
    match_request = {
        "required_skills": ["Python", "AWS", "Kubernetes", "Docker"],
        "min_match_percent": 25.0,
    }
    response = client.post("/api/v1/workforce/talent-match", json=match_request)
    assert response.status_code == 200
    payload = response.json()
    assert payload["totalCandidatesEvaluated"] >= 1
    assert isinstance(payload["candidates"], list)
    top_candidate = payload["candidates"][0]
    assert "matchPercentage" in top_candidate
    assert "missingSkills" in top_candidate


def test_workforce_model_metrics_endpoint() -> None:
    response = client.get("/api/v1/workforce/model-metrics")
    assert response.status_code == 200
    payload = response.json()
    assert payload["model_type"] == "RandomForestClassifier"
    assert payload["roc_auc"] > 0.85
    assert payload["precision"] > 0.60
    assert "confusion_matrix" in payload
    assert len(payload["feature_importances"]) >= 8


def test_workforce_digital_twin_scenario() -> None:
    req = {
        "scenario_type": "ATTRITION_SHOCK",
        "parameters": {"departing_count": 5},
    }
    response = client.post("/api/v1/workforce/digital-twin/simulate", json=req)
    assert response.status_code == 200
    payload = response.json()
    assert "projectedFinancialExposure" in payload
    assert payload["simulatedDepartures"] == 5


def test_auth_login_with_valid_credentials() -> None:
    credentials = {"email": "admin@enterprise.workforce", "password": "admin123"}
    response = client.post("/api/v1/auth/login", json=credentials)
    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert "access_token" in payload
    assert payload["user"]["role"] == "ADMIN"


def test_resume_parse_endpoint() -> None:
    response = client.get("/api/v1/resume/parse")
    assert response.status_code == 200
    payload = response.json()
    assert payload["total_skills_detected"] >= 4
    assert len(payload["skills"]) >= 4
