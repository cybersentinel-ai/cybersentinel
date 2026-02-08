import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the backend directory path
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "CyberSentinel"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"

    POSTGRES_USER: str = "cybersentinel"
    POSTGRES_PASSWORD: str = "cybersentinel"
    POSTGRES_DB: str = "cybersentinel"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    DATABASE_URL: str = "postgresql+asyncpg://cybersentinel:cybersentinel@localhost:5432/cybersentinel"

    REDIS_URL: str = "redis://localhost:6379/0"

    GEMINI_API_KEY: str = ""  # Will be loaded from .env

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

# Debug print to verify
print(f"📍 Looking for .env at: {ENV_FILE}")
print(f"📍 .env exists: {ENV_FILE.exists()}")
if settings.GEMINI_API_KEY:
    print(f"✅ GEMINI_API_KEY loaded: {settings.GEMINI_API_KEY[:15]}...")
else:
    print(f"❌ GEMINI_API_KEY not loaded!")
