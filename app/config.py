import os
from pydantic_settings import BaseSettings, SettingsConfigDict

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

    GEMINI_API_KEY: str = "placeholder"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
