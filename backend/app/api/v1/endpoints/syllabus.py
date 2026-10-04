from fastapi import APIRouter, Depends, HTTPException
from app.db.mongodb import db_client
from app.api.dependencies import get_current_user
from app.schemas.syllabus_schema import SyllabusTier

router = APIRouter()

@router.get("/", response_model=SyllabusTier)
async def get_syllabus(current_user: dict = Depends(get_current_user)):
    syllabus = await db_client.db.syllabuses.find_one({"user_id": current_user["_id"]})
    if not syllabus:
        raise HTTPException(status_code=404, detail="Syllabus not found")
    return syllabus

@router.post("/toggle_subtopic")
async def toggle_subtopic(subtopic_id: str, completed: bool, current_user: dict = Depends(get_current_user)):
    result = await db_client.db.syllabuses.update_one(
        {
            "user_id": current_user["_id"],
            "subjects.topics.subtopics.id": subtopic_id
        },
        {
            "$set": {"subjects.$[].topics.$[].subtopics.$[sub].completed": completed}
        },
        array_filters=[
            {"sub.id": subtopic_id}
        ]
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Subtopic not found or not updated")
    return {"status": "success", "completed": completed}

@router.post("/seed")
async def seed_syllabus(syllabus_data: SyllabusTier, current_user: dict = Depends(get_current_user)):
    # Helper endpoint to populate syllabus since no hardcoded data is allowed
    await db_client.db.syllabuses.update_one(
        {"user_id": current_user["_id"]},
        {"$set": {"subjects": [s.model_dump() for s in syllabus_data.subjects], "tier": syllabus_data.tier}},
        upsert=True
    )
    return {"status": "seeded"}