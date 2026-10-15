from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import AuditLog, User
from app.schemas.admin import AdminSettingsResponse, UserListResponse

router = APIRouter()


@router.get("/users", response_model=UserListResponse)
def list_users() -> UserListResponse:
    return UserListResponse(
        data=[
            {"id": 1, "email": "admin@enterprise.workforce", "role": "ADMIN"},
            {"id": 2, "email": "hr@enterprise.workforce", "role": "HR"},
            {"id": 3, "email": "manager@enterprise.workforce", "role": "MANAGER"},
        ]
    )


@router.get("/settings", response_model=AdminSettingsResponse)
def settings() -> AdminSettingsResponse:
    return AdminSettingsResponse(
        theme="dark",
        model="attrition_v1.0.0",
        audit="enabled",
    )


@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve immutable security and telemetry audit events."""
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    if not logs:
        # If table is empty, seed initial events
        events = [
            AuditLog(user_email="admin@enterprise.workforce", action="MODEL_EVALUATION_CALIBRATION", resource_type="pipeline", resource_id="rf_v1.0.0"),
            AuditLog(user_email="hr@enterprise.workforce", action="RESUME_NLP_EXTRACTION", resource_type="document", resource_id="Candidate_Profile.pdf"),
            AuditLog(user_email="manager@enterprise.workforce", action="SIMULATION_WHAT_IF", resource_type="employee", resource_id="EMP-104"),
            AuditLog(user_email="system.daemon", action="SKILL_GAP_DEFICIT_TRIGGER", resource_type="project", resource_id="Sprint-14"),
        ]
        for e in events:
            db.add(e)
        db.commit()
        logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

    return {
        "data": [
            {
                "id": f"EVT-{log.id:04d}",
                "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else "2026-10-14 21:00:00",
                "actor": log.user_email,
                "role": "ADMIN" if "admin" in log.user_email else "HR" if "hr" in log.user_email else "SYSTEM",
                "action": log.action,
                "target": f"{log.resource_type}:{log.resource_id}",
                "status": "ALERT" if "TRIGGER" in log.action else "SUCCESS",
            }
            for log in logs
        ]
    }

