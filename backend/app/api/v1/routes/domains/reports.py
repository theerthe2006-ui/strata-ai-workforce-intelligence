import csv
import io
from typing import Any
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import Employee, User

router = APIRouter()


@router.get("/export/employees/csv")
def export_employees_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Download formula-injection safe CSV export of active workforce registry."""
    employees = db.query(Employee).filter(Employee.employment_status == "Active").all()

    output = io.StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)

    # Standard formula-safe headers
    writer.writerow([
        "EmployeeNumber", "FirstName", "LastName", "Email", "Department",
        "RoleTitle", "Level", "Salary", "CompaRatio", "TenureYears",
        "SatisfactionScore", "EngagementScore", "AttritionRisk", "RiskTier"
    ])

    for emp in employees:
        # Sanitize against CSV formula injection (=, +, -, @)
        first_name = emp.first_name if not emp.first_name.startswith(('=', '+', '-', '@')) else f"'{emp.first_name}"
        last_name = emp.last_name if not emp.last_name.startswith(('=', '+', '-', '@')) else f"'{emp.last_name}"

        writer.writerow([
            emp.employee_number,
            first_name,
            last_name,
            emp.email,
            emp.department,
            emp.role_title,
            emp.level,
            emp.salary,
            emp.compa_ratio,
            emp.tenure_years,
            emp.satisfaction_score,
            emp.engagement_score,
            emp.attrition_risk,
            emp.risk_tier,
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=strata_workforce_export.csv"},
    )
