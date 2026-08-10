from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, HttpUrl, ConfigDict

class ShortenRequest(BaseModel):
    url: HttpUrl

class ShortenResponse(BaseModel):
    short_code: str
    short_url: str
    original_url: str

class URLStats(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    short_code: str
    original_URL: str
    click_count: int
    created_at: datetime