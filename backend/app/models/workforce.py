import json
from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
)
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(80), nullable=False)
    last_name = Column(String(80), nullable=False)
    role = Column(String(32), nullable=False, default="HR")  # ADMIN, HR, MANAGER, LEADERSHIP, EMPLOYEE
    department = Column(String(120), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False)
    code = Column(String(40), unique=True, nullable=False)
    budget = Column(Float, default=0.0)
    head_count = Column(Integer, default=0)


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    employee_number = Column(String(40), unique=True, index=True, nullable=False)
    first_name = Column(String(80), nullable=False)
    last_name = Column(String(80), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    department = Column(String(120), nullable=False, index=True)
    role_title = Column(String(120), nullable=False)
    level = Column(String(40), nullable=False, default="Mid")  # Junior, Mid, Senior, Lead, Director

    # Compensation & Tenure
    salary = Column(Float, nullable=False)
    salary_growth_rate = Column(Float, default=4.0)  # % annual growth
    compa_ratio = Column(Float, default=1.0)  # salary vs role benchmark (e.g. 0.85 = 15% underpaid)
    tenure_years = Column(Float, nullable=False, default=2.0)
    experience_years = Column(Float, nullable=False, default=4.0)
    age = Column(Integer, default=32)
    hire_date = Column(String(30), default="2022-01-15")

    # Performance, Engagement & Workload
    performance_score = Column(Float, default=3.5)  # 1.0 - 5.0
    satisfaction_score = Column(Float, default=70.0)  # 0 - 100
    engagement_score = Column(Float, default=72.0)  # 0 - 100
    monthly_hours = Column(Integer, default=168)  # standard ~160-170, burn-out > 200
    overtime_hours = Column(Integer, default=10)
    project_count = Column(Integer, default=2)
    promotions_count = Column(Integer, default=1)
    years_since_last_promotion = Column(Float, default=1.5)

    # Management
    manager_rating = Column(Float, default=4.0)  # 1.0 - 5.0
    manager_name = Column(String(120), default="Jordan Carter")

    # Attrition Risk Output (derived from ML model)
    attrition_risk = Column(Float, default=15.0)  # 0 - 100
    risk_tier = Column(String(30), default="Low")  # Low, Medium, High, Critical
    employment_status = Column(String(40), default="Active")  # Active, Resigned, On Leave
    avatar_url = Column(String(255), nullable=True)

    skills = relationship("EmployeeSkill", back_populates="employee", cascade="all, delete-orphan")
    recommendations = relationship("RetentionRecommendation", back_populates="employee", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, index=True, nullable=False)
    category = Column(String(80), nullable=False)  # Programming, Cloud, AI/ML, Data, DevOps, Security, Soft Skills
    description = Column(Text, nullable=True)
    market_demand_weight = Column(Float, default=1.0)
    is_emerging = Column(Boolean, default=False)
    is_declining = Column(Boolean, default=False)


class EmployeeSkill(Base):
    __tablename__ = "employee_skills"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    skill_name = Column(String(120), nullable=False)
    category = Column(String(80), nullable=False)
    proficiency = Column(Integer, nullable=False, default=3)  # 1: Novice, 2: Intermediate, 3: Advanced, 4: Expert, 5: Master
    confidence = Column(Float, default=0.90)
    last_used = Column(String(30), default="Current")

    employee = relationship("Employee", back_populates="skills")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(160), nullable=False)
    code = Column(String(40), unique=True, nullable=False)
    department = Column(String(120), nullable=False)
    priority = Column(String(40), default="High")  # Critical, High, Medium
    status = Column(String(40), default="Active")  # Active, Planning, Completed
    description = Column(Text, nullable=True)
    team_size_target = Column(Integer, default=5)


class ProjectRequirement(Base):
    __tablename__ = "project_requirements"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    skill_name = Column(String(120), nullable=False)
    min_proficiency = Column(Integer, default=3)
    headcount_needed = Column(Integer, default=2)


class AttritionPredictionRecord(Base):
    __tablename__ = "attrition_predictions"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    model_version = Column(String(40), default="rf_v1.0.0")
    predicted_probability = Column(Float, nullable=False)
    risk_tier = Column(String(30), nullable=False)
    top_factors_json = Column(Text, nullable=False, default="[]")
    shap_values_json = Column(Text, nullable=False, default="{}")
    prediction_date = Column(DateTime, default=datetime.utcnow)


class RetentionRecommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    intervention_type = Column(String(80), nullable=False)  # Compensation, Mentorship, Upskilling, Workload, Role Transition
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(40), default="High")  # Critical, High, Medium
    status = Column(String(40), default="Open")  # Open, In Progress, Resolved
    estimated_risk_reduction = Column(Float, default=15.0)  # percentage points
    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="recommendations")


class FutureSkillForecast(Base):
    __tablename__ = "future_skill_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(120), unique=True, nullable=False)
    category = Column(String(80), nullable=False)
    current_coverage = Column(Float, default=25.0)  # percentage of workforce possessing skill
    projected_demand_1yr = Column(Float, default=45.0)
    projected_demand_3yr = Column(Float, default=65.0)
    growth_rate = Column(Float, default=28.0)  # % YoY
    gap_tier = Column(String(30), default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    strategic_rationale = Column(Text, nullable=True)


class SuccessionPlan(Base):
    __tablename__ = "succession_plans"

    id = Column(Integer, primary_key=True, index=True)
    role_title = Column(String(120), nullable=False)
    department = Column(String(120), nullable=False)
    current_holder_name = Column(String(120), nullable=False)
    successor_name = Column(String(120), nullable=False)
    successor_employee_id = Column(Integer, nullable=True)
    readiness_tier = Column(String(40), default="Ready 6-12M")  # Ready Now, Ready 6-12M, Ready 1-2Y
    readiness_score = Column(Float, default=78.0)
    missing_skills_json = Column(Text, default="[]")


class WorkforceAlert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(60), nullable=False)  # ATTRITION_RISK, SKILL_GAP, SUCCESSION_GAP, WORKFORCE_CAPACITY
    severity = Column(String(30), nullable=False, default="HIGH")  # CRITICAL, HIGH, MEDIUM, INFO
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    entity_id = Column(String(60), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DigitalTwinScenario(Base):
    __tablename__ = "digital_twin_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(160), nullable=False)
    scenario_type = Column(String(60), nullable=False)  # ATTRITION_SHOCK, UPSKILLING_WAVE, TECH_SHIFT
    description = Column(Text, nullable=False)
    parameters_json = Column(Text, default="{}")
    results_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), nullable=False)
    action = Column(String(120), nullable=False)
    resource_type = Column(String(120), nullable=False)
    resource_id = Column(String(60), nullable=True)
    details_json = Column(Text, default="{}")
    timestamp = Column(DateTime, default=datetime.utcnow)
