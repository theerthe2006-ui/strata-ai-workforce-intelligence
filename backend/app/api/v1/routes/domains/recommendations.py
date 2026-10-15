from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import Employee, RetentionRecommendation, User

router = APIRouter()


class RecommendationCreate(BaseModel):
    employee_id: int
    intervention_type: str  # Compensation, Mentorship, Upskilling, Workload, Role Transition
    title: str
    description: str
    priority: str = "High"
    estimated_risk_reduction: float = 15.0


@router.get("")
def list_recommendations(
    priority: str | None = None,
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve rule-based retention and talent development recommendations."""
    query = db.query(RetentionRecommendation)
    if priority and priority != "All":
        query = query.filter(RetentionRecommendation.priority == priority)
    if status_filter and status_filter != "All":
        query = query.filter(RetentionRecommendation.status == status_filter)

    recs = query.all()
    results = []
    for r in recs:
        emp = db.query(Employee).filter(Employee.id == r.employee_id).first()
        results.append({
            "id": r.id,
            "employeeId": r.employee_id,
            "employeeNumber": emp.employee_number if emp else "N/A",
            "employeeName": f"{emp.first_name} {emp.last_name}" if emp else "Unknown",
            "department": emp.department if emp else "General",
            "type": r.intervention_type,
            "title": r.title,
            "description": r.description,
            "priority": r.priority,
            "status": r.status,
            "estimatedRiskReduction": r.estimated_risk_reduction,
            "createdAt": r.created_at.isoformat() if r.created_at else None,
        })

    return {"data": results, "total": len(results)}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_recommendation(
    payload: RecommendationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Create a new human-reviewed retention intervention."""
    emp = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee ID {payload.employee_id} not found.",
        )

    rec = RetentionRecommendation(
        employee_id=payload.employee_id,
        intervention_type=payload.intervention_type,
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        estimated_risk_reduction=payload.estimated_risk_reduction,
        status="Open",
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return {"message": "Recommendation recorded", "id": rec.id}


@router.patch("/{recommendation_id}/status")
def update_recommendation_status(
    recommendation_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update status of a recommendation (Open, In Progress, Resolved)."""
    rec = db.query(RetentionRecommendation).filter(RetentionRecommendation.id == recommendation_id).first()
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found.",
        )

    rec.status = new_status
    db.commit()
    return {"message": f"Recommendation status updated to {new_status}"}
