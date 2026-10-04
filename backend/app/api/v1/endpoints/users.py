from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user_schema import UserCreate, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.mongodb import db_client
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate):
    existing_user = await db_client.db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_in.model_dump()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    
    result = await db_client.db.users.insert_one(user_dict)
    
    # Generate seeded syllabus
    from app.services.seed_db import seed_user_syllabus
    await seed_user_syllabus(
        user_id=result.inserted_id,
        tier=user_in.tier,
        stream=user_in.stream,
        year_standard=user_in.year_sem,
        db_client=db_client
    )
    
    created_user = await db_client.db.users.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    return created_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db_client.db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    current_user["id"] = str(current_user["_id"])
    return current_user