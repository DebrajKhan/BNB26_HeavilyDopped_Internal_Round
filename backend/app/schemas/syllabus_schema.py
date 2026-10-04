from pydantic import BaseModel
from typing import List, Optional

class Subtopic(BaseModel):
    id: str
    title: str
    completed: bool = False
    video_url: Optional[str] = None

class Topic(BaseModel):
    id: str
    title: str
    subtopics: List[Subtopic]

class Subject(BaseModel):
    id: str
    title: str
    topics: List[Topic]

class SyllabusTier(BaseModel):
    tier: str # "School" or "College"
    subjects: List[Subject]