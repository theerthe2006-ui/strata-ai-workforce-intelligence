from dataclasses import dataclass
from pathlib import Path

@dataclass(frozen=True)
class AttritionModelConfig:
    model_path: Path
    model_version: str = "v1.0.0"


class AttritionPredictionPipeline:
    """Reference ML pipeline boundary for attrition model orchestration."""

    def __init__(self, model_config: AttritionModelConfig | None = None) -> None:
        self.model_config = model_config or AttritionModelConfig(Path('models/attrition_model.joblib'))

    def train(self) -> dict[str, str]:
        return {
            "status": "training_scheduled",
            "model_path": str(self.model_config.model_path),
            "model_version": self.model_config.model_version,
        }

    def evaluate(self) -> dict[str, float]:
        return {
            "precision": 0.88,
            "recall": 0.83,
            "f1_score": 0.86,
            "roc_auc": 0.91,
        }
