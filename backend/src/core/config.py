from pydantic_settings import BaseSettings
from pydantic import PostgresDsn
from typing import List

class Settings(BaseSettings):
    #for MAIN
    APP_NAME: str = "TAC"
    APP_VERSION: str = "0.1.1"
    DEBUG: bool = True

    #DATABASE
    DATABASE_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/TAC"
    DATABASE_TEST_URL: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/TAC_test"

    #AUTH
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    #SEC-TY
    ALLOWED_ORIGINS: List[str] = ["*"]

    #API
    API_PREFIX: str = "/api/v1"

    #Mail settings
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_SERVER: str = "smtp.mail.ru"
    MAIL_PORT: int = 587
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
