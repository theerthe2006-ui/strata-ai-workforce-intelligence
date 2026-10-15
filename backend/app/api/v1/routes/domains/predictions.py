from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import User
from app.services.workforce_service import workforce_service
from ml.predict_service import prediction_service

router = APIRouter()


class PredictionInferenceRequest(BaseModel):
    employee_id: str | int | None = None
    satisfaction_score: float = 70.0
    engagement_score: float = 72.0
    tenure_years: float = 2.5
    experience_years: float = 4.0
    salary: float = 85000.0
    compa_ratio: float = 1.0
    monthly_hours: int = 168
    overtime_hours: int = 10
    years_since_last_promotion: float = 1.5
    manager_rating: float = 4.0
    performance_score: float = 3.5


@router.get("/metrics")
def get_prediction_metrics(
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Model evaluation metrics: ROC-AUC, Precision, Recall, F1, Confusion Matrix."""
    return prediction_service.get_metrics()


@router.get("/employee/{employee_id}")
def get_employee_prediction(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve evaluated prediction score and explainability factors for specific employee."""
    emp_detail = workforce_service.get_employee_detail(db, employee_id)
    if not emp_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found.",
        )

    return {
        "employeeId": emp_detail["employeeNumber"],
        "name": emp_detail["fullName"],
        "role": emp_detail["roleTitle"],
        "department": emp_detail["department"],
        "riskLevel": emp_detail["riskTier"],
        "probability": round(emp_detail["attritionRisk"] / 100.0, 4),
        "confidence": emp_detail["confidenceScore"],
        "contributingFactors": emp_detail["contributingFactors"],
        "modelVersion": "rf_v1.0.0",
        "ethicalDisclaimer": "Decision support telemetry only. Never to be used as an automatic adverse action.",
    }


@router.post("/evaluate")
def run_custom_inference(
    payload: PredictionInferenceRequest,
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Execute live model inference pipeline on arbitrary candidate workforce parameters."""
    features = {
        "satisfaction_score": payload.satisfaction_score,
        "engagement_score": payload.engagement_score,
        "tenure_years": payload.tenure_years,
        "experience_years": payload.experience_years,
        "salary": payload.salary,
        "compa_ratio": payload.compa_ratio,
        "monthly_hours": payload.monthly_hours,
        "overtime_hours": payload.overtime_hours,
        "years_since_last_promotion": payload.years_since_last_promotion,
        "manager_rating": payload.manager_rating,
        "performance_score": payload.performance_score,
    }
    result = prediction_service.predict(features)
    return {
        "attrition_probability": result["probability"],
        "risk_tier": result["risk_tier"],
        "risk_score_percent": result["risk_score"],
        "contributing_factors": result["contributing_factors"],
        "model_version": result["model_version"],
    }
