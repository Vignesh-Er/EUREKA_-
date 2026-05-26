"""Database session management."""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from config import settings
from database.base import Base
import models # ensure models are loaded before create_all

class DatabaseEngine:
    _engine = None
    _async_session_maker = None

    @classmethod
    def get_engine(cls):
        if cls._engine is None:
            cls._engine = create_async_engine(settings.database_url, echo=settings.debug, pool_pre_ping=True)
        return cls._engine

    @classmethod
    def get_session_maker(cls):
        if cls._async_session_maker is None:
            cls._async_session_maker = async_sessionmaker(
                cls.get_engine(), class_=AsyncSession, expire_on_commit=False, autoflush=False
            )
        return cls._async_session_maker

    @classmethod
    async def create_tables(cls):
        async with cls.get_engine().begin() as conn:
            await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:
    session_maker = DatabaseEngine.get_session_maker()
    async with session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
