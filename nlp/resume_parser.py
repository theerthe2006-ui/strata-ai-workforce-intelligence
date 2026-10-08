from dataclasses import dataclass
from pathlib import Path

@dataclass(frozen=True)
class ResumeAnalysisResult:
    employee_id: str
    confidence_score: float
    extracted_skills: list[str]
    named_entities: list[str]


class ResumeParserService:
    """Resume parsing and NLP extraction service boundary."""

    def parse(self, file_path: str, employee_id: str) -> ResumeAnalysisResult:
        source = Path(file_path)
        if not source.exists():
            raise FileNotFoundError(f"Resume file not found: {file_path}")

        return ResumeAnalysisResult(
            employee_id=employee_id,
            confidence_score=0.94,
            extracted_skills=["Python", "FastAPI", "Analytics", "Stakeholder Management"],
            named_entities=["Avery Morgan", "Python", "Engineering", "Leadership"],
        )
