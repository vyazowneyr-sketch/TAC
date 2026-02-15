from pydantic import BaseSettings, PostgresDsn
from typing import List

class Settings(BaseSettings):
    #for MAIN
    APP_NAME="TAC"
    APP_VERSION="0.1.1"
    DEBUG: bool = True

    #DATABASE
    DATABASE_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/TAC"
    DATABASE_TEST_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/TAC_test"

    #AUTH

    #SEC-TY
    ALLOWED_ORIGINS: List[str] = ["*"]

    #API
    API_PREFIX: str = "/api/v1"

    class Config:
        env_file = ".env"
        case_sensitive = True #управление чуствительностью валидации

settings = Settings()