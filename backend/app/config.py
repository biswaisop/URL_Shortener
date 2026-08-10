import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql+asyncpg://dev:dev@db:5432/urlshortener"
    )
    BASE_URL: str = os.getenv("BASE_URL", "http://localhost:8000")
    SHORT_CODE_LENGTH: int = int(os.getenv("SHORT_CODE_LENGTH", "6"))
    FRONTEND_URL: str = str(os.getenv("FRONTEND_URL", ""))


settings = Settings()