from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "workforce-analytics-engine"}

@router.get("/health/ready")
def readiness_check() -> dict[str, str]:
    return {"status": "ready", "dependencies": "postgres, redis, ml-service"}
