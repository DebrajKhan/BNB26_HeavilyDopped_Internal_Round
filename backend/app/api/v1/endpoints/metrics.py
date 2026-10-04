from fastapi import APIRouter, Depends
from app.db.mongodb import db_client
from app.api.dependencies import get_current_user
from app.services.progress_calc import calculate_active_focus

router = APIRouter()

@router.get("/coverage")
async def get_metrics(current_user: dict = Depends(get_current_user)):
    syllabus = await db_client.db.syllabuses.find_one({"user_id": current_user["_id"]})
    if not syllabus or "subjects" not in syllabus:
        focus = {"topic": "No Data", "retention": 0.0, "coverage": 0.0}
    else:
        focus = calculate_active_focus(syllabus.get("subjects", []))
        
    assessments_cursor = db_client.db.assessments.find({"user_id": current_user["_id"]}).sort("_id", 1)
    assessments_docs = await assessments_cursor.to_list(length=10)
    
    assessments = []
    for a in assessments_docs:
        assessments.append({
            "id": str(a["_id"]),
            "title": a.get("title"),
            "status": a.get("status"),
            "date": a.get("date")
        })
        
    return {
        "coverage": focus.get("coverage", 0.0),
        "topic": focus.get("topic"),
        "retention": focus.get("retention", 0.0),
        "assessments": assessments
    }