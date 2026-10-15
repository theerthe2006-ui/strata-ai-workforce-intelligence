from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.workforce import Employee, EmployeeSkill, User
from app.services.workforce_service import workforce_service

router = APIRouter()


class EmployeeCreateRequest(BaseModel):
    employee_number: str
    first_name: str
    last_name: str
    email: str
    department: str
    role_title: str
    level: str = "Mid"
    salary: float = 85000.0
    compa_ratio: float = 1.0
    tenure_years: float = 2.0
    experience_years: float = 4.0
    satisfaction_score: float = 75.0
    engagement_score: float = 75.0
    monthly_hours: int = 168
    overtime_hours: int = 10
    manager_name: str = "Jordan Carter"


class EmployeeUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    department: str | None = None
    role_title: str | None = None
    level: str | None = None
    salary: float | None = None
    compa_ratio: float | None = None
    satisfaction_score: float | None = None
    engagement_score: float | None = None
    monthly_hours: int | None = None
    overtime_hours: int | None = None
    employment_status: str | None = None


@router.get("")
def list_employees(
    search: str | None = None,
    department: str | None = None,
    risk_tier: str | None = None,
    page: int = Query(1, ge=1),
    pageSize: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Search and filter workforce records with role-based scoping."""
    if current_user.role == "MANAGER" and current_user.department:
        department = current_user.department

    return workforce_service.list_employees(
        db, search=search, department=department, risk_tier=risk_tier, page=page, page_size=pageSize
    )


@router.get("/{employee_id}")
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve full employee profile, risk scores, and contributing factors."""
    emp_detail = workforce_service.get_employee_detail(db, employee_id)
    if not emp_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found.",
        )

    if current_user.role == "EMPLOYEE" and current_user.email != emp_detail["email"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employees may only access their own profile.",
        )

    return emp_detail


@router.post("", status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Create a new employee profile (Restricted to HR and ADMIN)."""
    if current_user.role not in ["ADMIN", "HR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR and Admin roles can create employee records.",
        )

    existing = db.query(Employee).filter(
        (Employee.employee_number == payload.employee_number) | (Employee.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee number or email already exists in workforce registry.",
        )

    new_emp = Employee(
        employee_number=payload.employee_number,
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        department=payload.department,
        role_title=payload.role_title,
        level=payload.level,
        salary=payload.salary,
        compa_ratio=payload.compa_ratio,
        tenure_years=payload.tenure_years,
        experience_years=payload.experience_years,
        satisfaction_score=payload.satisfaction_score,
        engagement_score=payload.engagement_score,
        monthly_hours=payload.monthly_hours,
        overtime_hours=payload.overtime_hours,
        manager_name=payload.manager_name,
        attrition_risk=15.0,
        risk_tier="Low",
        employment_status="Active",
    )
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)

    return {"message": "Employee created successfully", "id": new_emp.id, "employee_number": new_emp.employee_number}


@router.put("/{employee_id}")
def update_employee(
    employee_id: str,
    payload: EmployeeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Update employee details (Restricted to HR and ADMIN)."""
    if current_user.role not in ["ADMIN", "HR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR and Admin roles can update employee records.",
        )

    emp = db.query(Employee).filter(
        (Employee.employee_number == employee_id) | (Employee.id == int(employee_id) if employee_id.isdigit() else False)
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found.",
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(emp, field, value)

    db.commit()
    return {"message": f"Employee {emp.employee_number} updated successfully"}


@router.delete("/{employee_id}")
def deactivate_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Deactivate or archive employee record (Admin and HR only)."""
    if current_user.role not in ["ADMIN", "HR"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR and Admin roles can deactivate employees.",
        )

    emp = db.query(Employee).filter(
        (Employee.employee_number == employee_id) | (Employee.id == int(employee_id) if employee_id.isdigit() else False)
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found.",
        )

    emp.employment_status = "Deactivated"
    db.commit()
    return {"message": f"Employee {emp.employee_number} deactivated."}
