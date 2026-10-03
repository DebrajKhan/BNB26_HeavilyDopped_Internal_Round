from fastapi import APIRouter
from app.api.v1.endpoints import users, syllabus, metrics, assessments

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(syllabus.router, prefix="/syllabus", tags=["syllabus"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(assessments.router, prefix="/assessments", tags=["assessments"])