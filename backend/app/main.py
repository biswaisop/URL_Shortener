from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app import crud
from app.config import settings
from app.database import Base, engine, get_db
from app.schemas import ShortenRequest, ShortenResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)



log = logging.getLogger("URL shortener")


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Startup: verifying DB connection...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    log.info("Shutdown: API stopped")

app = FastAPI(
    title="URL Shortener API",
    description="A minimal shortener built with fastapi + postgres",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware( 
    CORSMiddleware,
    allow_origins=[settings.BASE_URL, "http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health", tags=["health"])
async def health_check():
    log.info("Health check hit")
    return {"status": "ok"}

@app.post("/api/v1/shorten", response_model=ShortenResponse, tags=["shorten"])
async def shorten_url(payload: ShortenRequest, db: AsyncSession = Depends(get_db)):
    url_object = await crud.create_short_url(
        db,
        str(payload.url)
    )
    return ShortenResponse(
        short_code=url_object.short_code,
        short_url=f"{settings.BASE_URL.rstrip('/')}/{url_object.short_code}",
        original_url=url_object.original_url
    )

@app.get("/{short_code}", tags=["redirect"])
async def redirect_to_original(short_code: str, db: AsyncSession = Depends(get_db)):
    url_obj = await crud.get_by_short_code(db, short_code)
    if url_obj is None:
        raise HTTPException(status_code=404, detail="Short code not found")
    await crud.increment_click_count(db, url_obj)
    return RedirectResponse(url=url_obj.original_url, status_code=307)

