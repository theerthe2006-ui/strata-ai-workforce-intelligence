from dataclasses import dataclass
from typing import Literal

RiskLevel = Literal["Low", "Medium", "High", "Critical"]

@dataclass(frozen=True)
class AttritionPrediction:
    employee_id: str
    risk_level: RiskLevel
    probability: float
    confidence: float
    recommendations: list[str]


class PredictionEngineService:
    """Domain service wrapper for prediction workflow boundaries."""

    def predict(self, employee_id: str) -> AttritionPrediction:
        return AttritionPrediction(
            employee_id=employee_id,
            risk_level="Medium",
            probability=0.38,
            confidence=0.91,
            recommendations=["Career roadmap review", "Manager intervention", "Training recommendation"],
        )
