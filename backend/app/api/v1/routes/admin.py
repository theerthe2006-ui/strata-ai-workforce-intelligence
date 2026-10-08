from fastapi import APIRouter

from app.schemas.admin import AdminSettingsResponse, UserListResponse

router = APIRouter()


@router.get("/users", response_model=UserListResponse)
def list_users() -> UserListResponse:
    return UserListResponse(
        data=[{"id": 1, "email": "admin@enterprise.workforce", "role": "ADMIN"}]
    )


@router.get("/settings", response_model=AdminSettingsResponse)
def settings() -> AdminSettingsResponse:
    return AdminSettingsResponse(
        theme="dark",
        model="attrition_v1.0.0",
        audit="enabled",
    )
