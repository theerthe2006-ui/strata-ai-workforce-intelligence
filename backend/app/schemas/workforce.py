from pydantic import BaseModel, Field


class TopRisk(BaseModel):
    department: str
    riskScore: int = Field(..., ge=0, le=100)
    reason: str


class WorkforceSummaryResponse(BaseModel):
    totalEmployees: int = Field(..., ge=0)
    attritionRisk: float = Field(..., ge=0, le=100)
    retentionIndex: float = Field(..., ge=0, le=100)
    coverage: float = Field(..., ge=0, le=100)
    topRisks: list[TopRisk]


class EmployeeListItem(BaseModel):
    id: str
    name: str
    department: str
    risk: str


class EmployeeListResponse(BaseModel):
    data: list[EmployeeListItem]
    page: int = Field(..., ge=1)
    pageSize: int = Field(..., ge=1)
    total: int = Field(..., ge=0)


class SkillGapItem(BaseModel):
    skill: str
    gapPercent: int = Field(..., ge=0, le=100)
    trainingPriority: str


class SkillGapResponse(BaseModel):
    gaps: list[SkillGapItem]


class AttritionPredictionResponse(BaseModel):
    employeeId: str
    riskLevel: str
    probability: float = Field(..., ge=0, le=1)
    confidence: float = Field(..., ge=0, le=1)
    recommendations: list[str]
