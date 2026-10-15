from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import User
from app.services.workforce_service import workforce_service

router = APIRouter()


@router.get("/summary")
def get_executive_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Executive Command Center Overview Metrics and Telemetry."""
    return workforce_service.get_executive_summary(db)


@router.get("/succession")
def get_succession_pipeline(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Leadership succession pipeline and key role readiness metrics."""
    plans = workforce_service.get_succession_pipeline(db)
    return {"successionPlans": plans, "total": len(plans)}
