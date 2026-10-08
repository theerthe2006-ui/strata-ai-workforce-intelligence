from dataclasses import dataclass

@dataclass(frozen=True)
class WorkforceOverview:
    total_employees: int
    attrition_risk: float
    retention_index: float
    skill_coverage: float


class WorkforceAnalyticsService:
    """Application service that coordinates domain and infrastructure concerns."""

    def get_overview(self) -> WorkforceOverview:
        return WorkforceOverview(
            total_employees=1284,
            attrition_risk=6.8,
            retention_index=94.1,
            skill_coverage=89.2,
        )
