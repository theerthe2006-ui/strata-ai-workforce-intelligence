from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import User
from app.services.workforce_service import workforce_service
from ml.predict_service import prediction_service

router = APIRouter()


class WhatIfSimulationRequest(BaseModel):
    employee_id: int | str
    satisfaction_score: float | None = None
    engagement_score: float | None = None
    monthly_hours: int | None = None
    overtime_hours: int | None = None
    compa_ratio: float | None = None
    years_since_last_promotion: float | None = None
    manager_rating: float | None = None
    salary_growth_rate: float | None = None


class TalentMatchRequest(BaseModel):
    required_skills: list[str]
    department: str | None = None
    min_match_percent: float = 30.0


class DigitalTwinScenarioRequest(BaseModel):
    scenario_type: str  # ATTRITION_SHOCK, UPSKILLING_WAVE, TECH_SHIFT
    parameters: dict[str, Any] = {}


@router.get("/summary")
def get_workforce_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Executive Command Center Overview (Module 1)"""
    return workforce_service.get_executive_summary(db)


@router.get("/employees")
def list_employees(
    search: str | None = None,
    department: str | None = None,
    risk_tier: str | None = None,
    page: int = Query(1, ge=1),
    pageSize: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Search and Filter Employee Intelligence Directory (Module 2)"""
    # Role-based restriction: Managers only see their own department
    if current_user.role == "MANAGER" and current_user.department:
        department = current_user.department

    return workforce_service.list_employees(
        db, search=search, department=department, risk_tier=risk_tier, page=page, page_size=pageSize
    )


@router.get("/employees/{employee_id}")
def get_employee_detail(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Detailed Employee Profile with SHAP Explainability & Interventions (Module 2 & 7)"""
    emp_detail = workforce_service.get_employee_detail(db, employee_id)
    if not emp_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found.",
        )

    # Role-based privacy safeguard: Employees can only view their own record
    if current_user.role == "EMPLOYEE" and current_user.email != emp_detail["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employees may only access their own profile and career recommendations.",
        )

    return emp_detail


@router.get("/skills/gaps")
def get_skill_gaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Organization Skill Gap Analysis (Module 6)"""
    return workforce_service.get_skill_gaps(db)


@router.get("/skills/forecast")
def get_future_skill_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Future Skill Demand Projections (Module 7)"""
    return workforce_service.get_future_skill_forecasts(db)


@router.get("/attrition/prediction")
def get_attrition_prediction(
    employee_id: str = "EMP-104",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Model Attrition Prediction with Explainable AI Factors (Module 3 & 4)"""
    emp_detail = workforce_service.get_employee_detail(db, employee_id)
    if not emp_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found.",
        )
    return {
        "employeeId": emp_detail["employeeNumber"],
        "name": emp_detail["fullName"],
        "role": emp_detail["roleTitle"],
        "department": emp_detail["department"],
        "riskLevel": emp_detail["riskTier"],
        "probability": round(emp_detail["attritionRisk"] / 100.0, 4),
        "confidence": emp_detail["confidenceScore"],
        "contributingFactors": emp_detail["contributingFactors"],
        "recommendations": [r["title"] for r in emp_detail["recommendations"]],
    }


@router.post("/attrition/simulate")
def simulate_intervention(
    payload: WhatIfSimulationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """
    Module 10 — What-If Intervention Simulator:
    Recalculates risk in real-time with the trained ML model!
    """
    emp = workforce_service.get_employee_detail(db, str(payload.employee_id))
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    current_features = {
        "satisfaction_score": emp["satisfactionScore"],
        "engagement_score": emp["engagementScore"],
        "monthly_hours": emp["monthlyHours"],
        "overtime_hours": emp["overtimeHours"],
        "compa_ratio": emp["compaRatio"],
        "years_since_last_promotion": emp["yearsSinceLastPromotion"],
        "tenure_years": emp["tenureYears"],
        "project_count": emp["projectCount"],
        "manager_rating": emp["managerRating"],
        "performance_score": emp["performanceScore"],
        "salary_growth_rate": emp["salaryGrowthRate"],
        "salary": emp["salary"],
    }

    # Extract user modifications
    modifications = {}
    for key in [
        "satisfaction_score",
        "engagement_score",
        "monthly_hours",
        "overtime_hours",
        "compa_ratio",
        "years_since_last_promotion",
        "manager_rating",
        "salary_growth_rate",
    ]:
        val = getattr(payload, key)
        if val is not None:
            modifications[key] = val

    result = prediction_service.simulate_what_if(current_features, modifications)
    result["employeeName"] = emp["fullName"]
    result["employeeNumber"] = emp["employeeNumber"]
    return result


@router.post("/talent-match")
def match_talent(
    payload: TalentMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Module 8 — Internal Talent Marketplace"""
    matches = workforce_service.match_talent(
        db,
        required_skills=payload.required_skills,
        target_department=payload.department,
        min_match_percent=payload.min_match_percent,
    )
    return {
        "requiredSkills": payload.required_skills,
        "totalCandidatesEvaluated": len(matches),
        "candidates": matches,
    }


@router.post("/digital-twin/simulate")
def simulate_digital_twin_scenario(
    payload: DigitalTwinScenarioRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Module 11 & 31 — Workforce Digital Twin Signature Simulation"""
    return workforce_service.run_digital_twin_scenario(
        db,
        scenario_type=payload.scenario_type,
        params=payload.parameters,
    )


@router.get("/succession")
def get_succession_pipeline(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Module 12 — Succession & Capacity Intelligence"""
    plans = workforce_service.get_succession_pipeline(db)
    return {"successionPlans": plans}


@router.get("/alerts")
def get_workforce_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Module 13 — Alert & Early Warning System"""
    alerts = workforce_service.get_alerts(db)
    return {"alerts": alerts, "unreadCount": sum(1 for a in alerts if not a["isRead"])}


@router.post("/alerts/{alert_id}/read")
def mark_alert_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, bool]:
    success = workforce_service.mark_alert_read(db, alert_id)
    return {"success": success}


@router.get("/model-metrics")
def get_model_evaluation_metrics(
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Module 3 & 4 — Transparent Model Performance & Evaluation Dashboard"""
    return prediction_service.get_metrics()
