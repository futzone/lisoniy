"""Core configuration module"""

from typing import List
from pydantic import Field, validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = Field(default="FastAPI Auth System")
    APP_VERSION: str = Field(default="1.0.0")
    DEBUG: bool = Field(default=False)
    ENVIRONMENT: str = Field(default="development")
    
    # Server
    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000)
    
    # Database (PostgreSQL)
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/fastapi_auth"
    )
    DB_ECHO: bool = Field(default=False)
    DB_POOL_SIZE: int = Field(default=50)
    DB_MAX_OVERFLOW: int = Field(default=100)
    
    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    REDIS_MAX_CONNECTIONS: int = Field(default=100)
    
    # JWT Configuration
    SECRET_KEY: str = Field(
        default="your-super-secret-key-change-this-in-production-min-32-chars"
    )
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)
    
    # Email Configuration (SMTP / Resend)
    SMTP_HOST: str = Field(default="smtp.gmail.com")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="")
    SMTP_PASSWORD: str = Field(default="")
    SMTP_FROM_EMAIL: str = Field(default="noreply@example.com")
    SMTP_FROM_NAME: str = Field(default="FastAPI Auth System")
    RESEND_API_KEY: str = Field(default="")
    
    # Celery Configuration
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/1")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379/2")
    
    # Security Settings
    OTP_EXPIRE_MINUTES: int = Field(default=10)
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    ALLOWED_HOSTS: List[str] = Field(default=["*"])
    
    # CORS Settings
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:5173", 
            "http://localhost:8000",
        ]
    )
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = Field(default=100)
    RATE_LIMIT_WINDOW: int = Field(default=60)  # seconds
    
    # Bot Configuration
    BOT_TOKEN: str = Field(default="")

    # File Uploads
    UPLOADS_DIR: str = Field(default="/app/uploads")  # Directory for uploaded files
    
    @validator("SECRET_KEY")
    def validate_secret_key(cls, v: str) -> str:
        """Ensure SECRET_KEY is strong enough for production"""
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
