from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Literal
from app.models.user_model import PyObjectId

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    tier: Literal["School", "College"]
    institution_name: Optional[str] = None
    stream: Optional[str] = None
    year_sem: Optional[str] = None
    percentage: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str

class UserResponse(UserBase):
    id: str
    class Config:
        populate_by_name = True
        json_encoders = {PyObjectId: str}

class Token(BaseModel):
    access_token: str
    token_type: str