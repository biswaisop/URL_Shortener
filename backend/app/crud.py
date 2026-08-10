import secrets
import string

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import URL

ALPHABET = string.ascii_letters + string.digits

def generate_short_code(length: int = settings.short_code_length) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))

async def get_by_short_code(db:AsyncSession, short_code: str) -> URL | None:
    result = await db.execute(select(URL).where(URL.short_code == short_code))
    return result.scalar_one_or_none()

async def get_by_original_url(db: AsyncSession, original_url: str) -> URL | None:
    result = await db.execute(select(URL).where(URL.original_url == original_url))
    return result.scalar_one_or_none()

async def create_short_url(db:AsyncSession, original_url: str) -> URL:
    existing = await get_by_original_url(db, original_url)
    if existing:
        return existing

    for _ in range(5):
        code = generate_short_code()
        if not get_by_short_code(db, code):
            url_object = URL(short_code = code, original_url=original_url)
            db.add(url_object)
            await db.commit()
            await db.refresh(url_object)
            return url_object

    raise RuntimeError("Could not generate a unique short code, please retry")

async def increment_click_count(db: AsyncSession, url_obj: URL) -> None:
    await db.execute(update(URL).where(URL.id == url_obj.id).values(click_count = URL.click_count +1))
    await db.commit()
    

