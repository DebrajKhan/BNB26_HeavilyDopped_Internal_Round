from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str 
    JWT_SECRET: str 
    JWT_ALGORITHM: str = "HS256"
    GEMINI_API_KEY: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()