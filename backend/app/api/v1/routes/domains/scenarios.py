from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import User
from app.services.workforce_service import workforce_service

router = APIRouter()


class WhatIfRequest(BaseModel):
    employee_id: int | str
    satisfaction_score: float | None = None
    engagement_score: float | None = None
    monthly_hours: int | None = None
    overtime_hours: int | None = None
    compa_ratio: float | None = None
    years_since_last_promotion: float | None = None
    manager_rating: float | None = None
    salary_growth_rate: float | None = None


class DigitalTwinRequest(BaseModel):
    scenario_type: str  # ATTRITION_SHOCK, UPSKILLING_WAVE, TECH_SHIFT
    parameters: dict[str, Any] = {}


@router.post("/simulate/what-if")
def simulate_individual_retention(
    payload: WhatIfRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Simulate individual employee retention outcomes under hypothetical interventions."""
    emp = workforce_service.get_employee_detail(db, str(payload.employee_id))
    if not emp:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Employee {payload.employee_id} not found")

    from ml.predict_service import prediction_service

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


@router.post("/simulate/digital-twin")
def simulate_workforce_shock(
    payload: DigitalTwinRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Execute macro Workforce Digital Twin scenario simulation."""
    return workforce_service.run_digital_twin_scenario(
        db,
        scenario_type=payload.scenario_type,
        params=payload.parameters,
    )
