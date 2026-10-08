from pydantic import BaseModel, Field


class UserListItem(BaseModel):
    id: int
    email: str
    role: str


class UserListResponse(BaseModel):
    data: list[UserListItem]


class AdminSettingsResponse(BaseModel):
    theme: str = Field(..., min_length=1)
    model: str = Field(..., min_length=1)
    audit: str = Field(..., min_length=1)
