from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class EmployeeBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=80)
    last_name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    department_id: int
    manager_id: Optional[int] = None
    salary: float = Field(..., ge=0)
    experience_years: float = Field(..., ge=0)

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeRead(EmployeeBase):
    id: int
    is_active: bool
