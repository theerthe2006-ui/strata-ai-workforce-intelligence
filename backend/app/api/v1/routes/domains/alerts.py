from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import User, WorkforceAlert
from app.services.workforce_service import workforce_service

router = APIRouter()


class AlertCreate(BaseModel):
    alert_type: str
    severity: str = "HIGH"
    title: str
    description: str
    entity_id: str | None = None


@router.get("")
def list_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve workforce early warnings and system notifications."""
    alerts = workforce_service.get_alerts(db)
    return {"alerts": alerts, "unreadCount": sum(1 for a in alerts if not a["isRead"])}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_alert(
    payload: AlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Manually dispatch a workforce alert (HR and Admin)."""
    if current_user.role not in ["ADMIN", "HR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR and Admin can create workforce alerts.",
        )

    alert = WorkforceAlert(
        alert_type=payload.alert_type,
        severity=payload.severity,
        title=payload.title,
        description=payload.description,
        entity_id=payload.entity_id,
        is_read=False,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return {"message": "Alert created", "id": alert.id}


@router.post("/{alert_id}/read")
def mark_alert_as_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, bool]:
    """Mark an alert notification as acknowledged."""
    success = workforce_service.mark_alert_read(db, alert_id)
    return {"success": success}
