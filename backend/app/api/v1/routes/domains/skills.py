from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import Skill, User
from app.services.workforce_service import workforce_service

router = APIRouter()


class TalentMatchPayload(BaseModel):
    required_skills: list[str]
    department: str | None = None
    min_match_percent: float = 30.0


@router.get("")
def list_skills(
    category: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """List standard skills taxonomy dictionary."""
    query = db.query(Skill)
    if category:
        query = query.filter(Skill.category == category)
    skills = query.all()
    return {
        "data": [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "marketDemandWeight": s.market_demand_weight,
                "isEmerging": s.is_emerging,
            }
            for s in skills
        ],
        "total": len(skills),
    }


@router.get("/gaps")
def get_skill_gaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Organization skill gap detection against active project requirements."""
    return workforce_service.get_skill_gaps(db)


@router.get("/forecast")
def get_future_skill_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Future skill demand projections (1-Year and 3-Year forecast horizons)."""
    return workforce_service.get_future_skill_forecasts(db)


@router.post("/match")
def match_talent(
    payload: TalentMatchPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Match candidates across enterprise skills inventory against role specifications."""
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
