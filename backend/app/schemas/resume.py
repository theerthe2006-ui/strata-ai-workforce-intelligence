from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    message: str
    storage: str


class ResumeParseResponse(BaseModel):
    skills: list[str]
