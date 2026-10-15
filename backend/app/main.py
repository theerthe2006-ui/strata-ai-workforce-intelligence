from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.v1.routes import admin, auth, health, resume, workforce
from app.api.v1.routes.domains import (
    alerts as domain_alerts,
    analytics as domain_analytics,
    departments as domain_departments,
    employees as domain_employees,
    predictions as domain_predictions,
    recommendations as domain_recommendations,
    reports as domain_reports,
    scenarios as domain_scenarios,
    skills as domain_skills,
)
from app.config.settings import settings
from app.data.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created and synthetic data seeded
    seed_database()
    yield


app = FastAPI(
    title=settings.project_name,
    version=settings.api_version,
    description="STRATA.AI Enterprise Workforce Intelligence & Talent Transformation API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts,
)

app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(workforce.router, prefix="/api/v1/workforce", tags=["workforce"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(resume.router, prefix="/api/v1/resume", tags=["resume"])

# Modular Enterprise Domain Routers
app.include_router(domain_employees.router, prefix="/api/v1/employees", tags=["employees"])
app.include_router(domain_departments.router, prefix="/api/v1/departments", tags=["departments"])
app.include_router(domain_skills.router, prefix="/api/v1/skills", tags=["skills"])
app.include_router(domain_predictions.router, prefix="/api/v1/predictions", tags=["predictions"])
app.include_router(domain_recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"])
app.include_router(domain_alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(domain_analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(domain_reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(domain_scenarios.router, prefix="/api/v1/scenarios", tags=["scenarios"])


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": settings.project_name,
        "version": settings.api_version,
        "tagline": "From Workforce Risk to Workforce Readiness",
        "status": "online",
    }

