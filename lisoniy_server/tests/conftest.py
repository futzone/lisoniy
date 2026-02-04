"""Pytest configuration and fixtures for API tests"""

import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from uuid import uuid4

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.dataset import Dataset
from app.models.post import Post
from app.models.terminology import Term, TermAuditLog, AuditAction, Category
from app.core.security import get_password_hash


# Test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/lisoniy_test"


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create test database session"""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        yield session
        await session.rollback()
    
    await engine.dispose()


@pytest.fixture
async def async_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create async HTTP client"""
    
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    
    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(db_session: AsyncSession) -> dict:
    """Create test user"""
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        full_name="Test User",
        is_active=True,
        is_verified=True,
        role=UserRole.USER
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    return {"id": user.id, "email": user.email}


@pytest.fixture
async def test_user_empty(db_session: AsyncSession) -> dict:
    """Create test user with no activity"""
    user = User(
        email="empty@example.com",
        hashed_password=get_password_hash("testpassword"),
        full_name="Empty User",
        is_active=True,
        is_verified=True,
        role=UserRole.USER
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    return {"id": user.id, "email": user.email}


@pytest.fixture
async def auth_headers(async_client: AsyncClient, test_user: dict) -> dict:
    """Get authentication headers"""
    # Login to get token
    login_data = {
        "username": test_user["email"],
        "password": "testpassword"
    }
    response = await async_client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def test_dataset(db_session: AsyncSession, test_user: dict) -> dict:
    """Create test dataset"""
    from app.services.dataset_service import DatasetService
    from app.schemas.dataset import DatasetCreate
    
    dataset_data = DatasetCreate(
        name="Test Dataset",
        type="legal_qa",
        description="A test dataset",
        is_public=True
    )
    
    dataset = await DatasetService.create_dataset(db_session, dataset_data, test_user["id"])
    await db_session.commit()
    
    return {"id": str(dataset.id), "name": dataset.name}


@pytest.fixture
async def test_category(db_session: AsyncSession) -> dict:
    """Create test category"""
    category = Category(
        slug="test-category",
        name="Test Category",
        description="A test category"
    )
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)
    
    return {"id": str(category.id), "slug": category.slug}


@pytest.fixture
async def test_term(db_session: AsyncSession, test_user: dict, test_category: dict) -> dict:
    """Create test term"""
    term = Term(
        keyword="test_keyword",
        category_id=test_category["id"],
        creator_id=test_user["id"]
    )
    db_session.add(term)
    await db_session.commit()
    await db_session.refresh(term)
    
    return {"id": str(term.id), "keyword": term.keyword}


@pytest.fixture
async def test_term_audit_log(db_session: AsyncSession, test_user: dict, test_term: dict) -> dict:
    """Create test term audit log"""
    audit_log = TermAuditLog(
        term_id=test_term["id"],
        user_id=test_user["id"],
        action=AuditAction.CREATE,
        changes=None
    )
    db_session.add(audit_log)
    await db_session.commit()
    await db_session.refresh(audit_log)
    
    return {"id": str(audit_log.id)}


@pytest.fixture
async def test_discussion(db_session: AsyncSession, test_user: dict) -> dict:
    """Create test discussion post"""
    post = Post(
        title="Test Discussion",
        body="This is a test discussion",
        type="discussion",
        owner_id=test_user["id"],
        is_published=True
    )
    db_session.add(post)
    await db_session.commit()
    await db_session.refresh(post)
    
    return {"id": post.id, "title": post.title}


@pytest.fixture
async def test_article(db_session: AsyncSession, test_user: dict) -> dict:
    """Create test article post"""
    post = Post(
        title="Test Article",
        body="This is a test article",
        type="article",
        owner_id=test_user["id"],
        is_published=True
    )
    db_session.add(post)
    await db_session.commit()
    await db_session.refresh(post)
    
    return {"id": post.id, "title": post.title}


@pytest.fixture
async def create_multiple_datasets(db_session: AsyncSession):
    """Fixture factory for creating multiple datasets"""
    async def _create(user_id: int, count: int):
        from app.services.dataset_service import DatasetService
        from app.schemas.dataset import DatasetCreate
        
        datasets = []
        for i in range(count):
            dataset_data = DatasetCreate(
                name=f"Dataset {i}",
                type="legal_qa",
                description=f"Dataset {i} description",
                is_public=True
            )
            dataset = await DatasetService.create_dataset(db_session, dataset_data, user_id)
            datasets.append(dataset)
        
        await db_session.commit()
        return datasets
    
    return _create


@pytest.fixture
async def test_datasets_with_dates(db_session: AsyncSession, test_user: dict):
    """Create test datasets with different created_at dates"""
    from app.services.dataset_service import DatasetService
    from app.schemas.dataset import DatasetCreate
    from datetime import datetime, timedelta
    
    datasets = []
    for i in range(3):
        dataset_data = DatasetCreate(
            name=f"Dataset {i}",
            type="legal_qa",
            description=f"Dataset {i}",
            is_public=True
        )
        dataset = await DatasetService.create_dataset(db_session, dataset_data, test_user["id"])
        # Manually set created_at for testing
        dataset.created_at = datetime.utcnow() - timedelta(days=i)
        datasets.append(dataset)
    
    await db_session.commit()
    return datasets
