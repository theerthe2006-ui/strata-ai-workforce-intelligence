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
    role_transition_project_code: str | None = None


class DigitalTwinRequest(BaseModel):
    scenario_type: str  # ATTRITION_SHOCK, UPSKILLING_WAVE, TECH_SHIFT
    parameters: dict[str, Any] = {}


@router.post("/simulate/what-if")
def simulate_individual_retention(
    payload: WhatIfRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Simulate individual employee retention outcomes under hypothetical interventions and role transitions."""
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

    try:
        return workforce_service.simulate_role_transition_what_if(
            db=db,
            employee_id_or_number=str(payload.employee_id),
            modifications=modifications,
            role_transition_project_code=payload.role_transition_project_code,
        )
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=str(e))


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
