from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import Department, Employee, User

router = APIRouter()


@router.get("")
def list_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve list of enterprise departments with active headcounts and budget telemetry."""
    departments = db.query(Department).all()
    results = []
    for dept in departments:
        count = db.query(Employee).filter(
            Employee.department == dept.name,
            Employee.employment_status == "Active"
        ).count()
        results.append({
            "id": dept.id,
            "name": dept.name,
            "code": dept.code,
            "budget": dept.budget,
            "headCount": count if count > 0 else dept.head_count,
        })

    return {"data": results, "total": len(results)}
