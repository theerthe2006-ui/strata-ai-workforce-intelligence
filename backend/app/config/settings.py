import json
import os
import sys
import warnings
from pathlib import Path
from typing import Any

from pydantic_settings import BaseSettings, SettingsConfigDict

# -------------------------------------------------------------------
# Development-only fallback key.  This value is NEVER accepted in
# production — see _resolve_secret_key() below.
# -------------------------------------------------------------------
_DEV_FALLBACK_KEY = "dev-only-insecure-key-do-not-use-in-production"


def _resolve_secret_key() -> str:
    """Return a safe SECRET_KEY or abort in production.

    Rules:
      • If the ``SECRET_KEY`` environment variable is set to a
        sufficiently strong value (≥ 32 characters, not the dev
        fallback), use it.
      • In **development** (``APP_ENV`` != ``production``), fall back
        to the well-known dev key so that ``python -m pytest`` and
        local ``uvicorn`` work without any env setup.
      • In **production**, refuse to start with a weak or missing key.
    """
    env_key = os.environ.get("SECRET_KEY", "").strip()
    app_env = os.environ.get("APP_ENV", "development").lower()

    if env_key and env_key != _DEV_FALLBACK_KEY and len(env_key) >= 32:
        return env_key                        # strong key — all good

    if app_env == "production":
        print(
            "FATAL: SECRET_KEY is missing, too short (< 32 chars), or "
            "set to the development placeholder.  Set a strong "
            "SECRET_KEY environment variable before starting in "
            "production.",
            file=sys.stderr,
        )
        sys.exit(1)

    # Development / CI — use the harmless placeholder
    if env_key and env_key != _DEV_FALLBACK_KEY:
        warnings.warn(
            f"SECRET_KEY is only {len(env_key)} characters long; "
            "use ≥ 32 characters in production.",
            stacklevel=2,
        )
        return env_key
    return _DEV_FALLBACK_KEY


def _parse_string_list(raw: Any) -> list[str]:
    """Accept a JSON array, a comma-separated string, or a plain string
    and always return ``list[str]``.  This is the single canonical
    parser used by both ``allowed_origins`` and ``allowed_hosts`` so
    that *any* env-var format works with pydantic-settings.
    """
    if isinstance(raw, list):
        return [str(v).strip() for v in raw if str(v).strip()]
    if not isinstance(raw, str):
        return [str(raw)]
    raw = raw.strip()
    if not raw:
        return []
    # Try JSON array first: '["https://a.com","https://b.com"]'
    if raw.startswith("["):
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                return [str(v).strip() for v in parsed if str(v).strip()]
        except (json.JSONDecodeError, TypeError):
            pass
    # Comma-separated: "https://a.com,https://b.com"
    if "," in raw:
        return [v.strip() for v in raw.split(",") if v.strip()]
    # Single value: "*"
    return [raw]


def _normalize_list_env_var(var_name: str) -> None:
    """If the environment variable *var_name* is set, convert its value
    to a JSON array that pydantic-settings can decode natively for a
    ``list[str]`` field.  This runs **before** ``Settings()`` so the
    ``EnvSettingsSource`` never sees a format it cannot parse.
    """
    raw = os.environ.get(var_name)
    if raw is None:
        return
    parsed = _parse_string_list(raw)
    os.environ[var_name] = json.dumps(parsed)


_DEFAULT_DEV_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]


# ---- Normalize env vars before constructing Settings -----------------
_normalize_list_env_var("ALLOWED_ORIGINS")
_normalize_list_env_var("ALLOWED_HOSTS")


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
    secret_key: str = _resolve_secret_key()
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 120
    refresh_token_expire_days: int = 7
    allowed_origins: list[str] = _DEFAULT_DEV_ORIGINS
    allowed_hosts: list[str] = ["*"]
    frontend_origin: str = ""
    ml_model_dir: Path = Path(__file__).resolve().parent.parent.parent.parent / "ml" / "artifacts"
    upload_dir: Path = Path(__file__).resolve().parent.parent.parent.parent / "uploads"

settings = Settings()
if settings.frontend_origin:
    settings.allowed_origins = list(dict.fromkeys([settings.frontend_origin.rstrip("/"), *settings.allowed_origins]))
