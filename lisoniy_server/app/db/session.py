"""Database session management with async SQLAlchemy"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker
)
from sqlalchemy.pool import NullPool, QueuePool

from app.core.config import settings

# Create async engine with connection pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    poolclass=NullPool,  # Use NullPool to prevent connection pool exhaustion/deadlocks
    # pool_size=settings.DB_POOL_SIZE, # Disabled for NullPool
    # max_overflow=settings.DB_MAX_OVERFLOW, # Disabled for NullPool
    # pool_pre_ping=True,  # Disabled for NullPool (connections are always fresh)
    # pool_recycle=3600,   # Disabled for NullPool
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get database session
    
    Yields:
        Database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
