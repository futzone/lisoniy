
import asyncio
import sys
import os
from datetime import datetime
from typing import Optional

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select, func, desc, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

# Define Base locally
class Base(DeclarativeBase):
    pass

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

# Define User locally
class User(Base, TimestampMixin):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    # hashing password not needed for query
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # Add other fields if needed for the query

# Define Post locally
class Post(Base, TimestampMixin):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

# Hardcode database URL from config.py
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/fastapi_auth"

engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def main():
    async with AsyncSessionLocal() as db:
        print("Checking users...")
        try:
            users = (await db.execute(select(User))).scalars().all()
            print(f"Total users: {len(users)}")
            for u in users:
                print(f"User: {u.id}, {u.email}, {u.full_name}")
        except Exception as e:
            print(f"Error checking users: {e}")

        print("\nChecking posts...")
        try:
            posts = (await db.execute(select(Post))).scalars().all()
            print(f"Total posts: {len(posts)}")
            for p in posts:
                print(f"Post: {p.id}, {p.title}, owner_id: {p.owner_id}")
        except Exception as e:
            print(f"Error checking posts: {e}")

        print("\nRunning Top Authors Query...")
        try:
            stmt = (
                select(
                    User.id, 
                    User.full_name, 
                    User.email, 
                    User.is_verified, 
                    func.literal("").label("avatar_url"),
                    func.count(Post.id).label("contributions")
                )
                .join(Post, User.id == Post.owner_id)
                .group_by(User.id, User.full_name, User.email, User.is_verified)
                .order_by(desc("contributions"))
                .limit(5)
            )
            result = await db.execute(stmt)
            rows = result.all()
            print(f"Query Result Rows: {len(rows)}")
            for row in rows:
                print(row)
        except Exception as e:
            print(f"Error executing query: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    try:
        if sys.platform == 'win32':
             asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(main()) 
    except KeyboardInterrupt:
        pass
