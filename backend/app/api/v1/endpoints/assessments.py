from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.db.mongodb import db_client
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/")
async def get_assessments(current_user: dict = Depends(get_current_user)):
    cursor = db_client.db.assessments.find({"user_id": current_user["_id"]}).sort("_id", 1)
    docs = await cursor.to_list(length=50)
    
    return [
        {
            "id": str(doc["_id"]),
            "title": doc.get("title"),
            "status": doc.get("status"),
            "date": doc.get("date")
        }
        for doc in docs
    ]

@router.get("/{assessment_id}/questions")
async def get_assessment_questions(assessment_id: str, current_user: dict = Depends(get_current_user)):
    try:
        obj_id = ObjectId(assessment_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid assessment ID")
        
    doc = await db_client.db.assessments.find_one({
        "_id": obj_id,
        "user_id": current_user["_id"]
    })
    
    if not doc:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    return {"questions": doc.get("questions", [])}
