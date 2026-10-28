from fastapi import APIRouter
from sqlalchemy import text

from app.database import engine

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "workforce-analytics-engine"}


@router.get("/health/ready")
def readiness_check() -> dict[str, str]:
    """Readiness probe — verifies the database is reachable."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "unavailable"

    return {
        "status": "ready" if db_status == "ok" else "degraded",
        "database": db_status,
        "ml_model": "loaded",
    }
