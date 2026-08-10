from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    DATABASE_URL: str = "postgresql+asyncpg://dev:dev@db:5432/urlshortener"
    BASE_URL: str = "http://localhost:8000"
    SHORT_CODE_LENGTH: int = 6

settings = Settings()