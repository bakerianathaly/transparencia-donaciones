import os
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

DATABASE_URL = os.getenv("DATABASE_URL")
SCHEMA_NAME = os.getenv("SCHEMA_NAME")

async_url = DATABASE_URL.split("?")[0].replace("postgresql://", "postgresql+asyncpg://")

async_engine = create_async_engine(
    async_url,
    connect_args={"server_settings": {"search_path": SCHEMA_NAME}},
    pool_size=40,  # conexiones permanentes en el pool
    max_overflow=10,  # conexiones extra permitidas cuando el pool está lleno
    pool_timeout=30,
    pool_pre_ping=True,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(async_engine, expire_on_commit=False) as session:
        yield session
