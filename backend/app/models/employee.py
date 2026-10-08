from sqlalchemy import Boolean, Column, Date, Float, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(80), nullable=False)
    last_name = Column(String(80), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    department_id = Column(Integer, nullable=False)
    manager_id = Column(Integer, nullable=True)
    salary = Column(Float, nullable=False)
    experience_years = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
