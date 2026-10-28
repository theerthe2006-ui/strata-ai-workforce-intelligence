from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore',
        protected_namespaces=('settings_',)
    )

    project_name: str = "STRATA.AI Enterprise Workforce Intelligence"
    api_version: str = "v1"
    app_env: str = "development"
    debug: bool = True
    database_url: str = f"sqlite:///{(Path(__file__).resolve().parent.parent.parent / 'strata_workforce.db').as_posix()}"
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str = "strata-ai-production-quality-secret-key-2026-secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 120
    refresh_token_expire_days: int = 7
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000"
    ]
    allowed_hosts: list[str] = ["*"]
    frontend_origin: str = ""
    ml_model_dir: Path = Path(__file__).resolve().parent.parent.parent.parent / "ml" / "artifacts"
    upload_dir: Path = Path(__file__).resolve().parent.parent.parent.parent / "uploads"

settings = Settings()
if settings.frontend_origin:
    settings.allowed_origins = list(dict.fromkeys([settings.frontend_origin.rstrip("/"), *settings.allowed_origins]))

