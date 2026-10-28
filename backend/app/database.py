import os
from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from app.config.settings import settings

db_url = settings.database_url
# Render and some PostgreSQL providers still supply the legacy postgres:// scheme.
# SQLAlchemy 2 expects postgresql://.
if db_url.startswith("postgres://"):
    db_url = "postgresql://" + db_url[len("postgres://"):]
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency to provide a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
