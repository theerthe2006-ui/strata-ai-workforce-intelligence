from typing import Any
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from nlp.resume_engine import resume_engine

router = APIRouter()


@router.post("/upload")
async def upload_and_parse_resume(
    file: UploadFile = File(...),
) -> dict[str, Any]:
    """
    Module 4 — Resume / Document Intelligence:
    Extracts text from PDF, DOCX, or TXT documents, performs NLP entity
    recognition, taxonomy normalization, proficiency estimation, and role matching.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a filename.",
        )

    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        parsed_profile = resume_engine.parse_resume(content, file.filename)
        return {
            "status": "success",
            "message": f"Successfully parsed {file.filename}",
            "profile": parsed_profile,
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        ) from val_err
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while parsing resume document: {e}",
        ) from e


@router.get("/parse")
def sample_parsed_profile() -> dict[str, Any]:
    """Sample parsed profile reference for demonstration testing."""
    sample_text = (
        "Marcus Vance - Senior Cloud Platform Engineer with 8 years experience in Python, "
        "AWS, Kubernetes, Terraform, Docker, Go, FastAPI, and Cloud Security. "
        "Built multi-region fault-tolerant Kubernetes architectures and CI/CD pipelines."
    )
    return resume_engine.parse_resume(sample_text.encode("utf-8"), "marcus_vance_sample.txt")
