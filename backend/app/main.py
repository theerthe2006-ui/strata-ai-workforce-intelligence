from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.v1.routes import admin, auth, health, resume, workforce
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


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": settings.project_name,
        "version": settings.api_version,
        "tagline": "From Workforce Risk to Workforce Readiness",
        "status": "online",
    }

