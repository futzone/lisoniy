"""Seed data script for terminology system testing"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session_maker
from app.models.terminology import Category
from app.schemas.terminology import CategoryCreate, TermCreate, DefinitionCreate
from app.services.category_service import CategoryService
from app.services.term_service import TermService


async def seed_categories(db: AsyncSession):
    """Seed initial categories"""
    categories_data = [
        CategoryCreate(
            slug="it-texnologiyalari",
            name="IT Texnologiyalari",
            description="Axborot texnologiyalari sohasidagi atamalar"
        ),
        CategoryCreate(
            slug="dasturlash",
            name="Dasturlash",
            description="Dasturlash tillari va tushunchalarSohasidagi terminlar"
        ),
        CategoryCreate(
            slug="sun-iy-intellekt",
            name="Sun'iy Intellekt",
            description="Sun'iy intellekt va mashina o'rganish atamadagi"
        ),
    ]
    
    created = []
    for cat_data in categories_data:
        try:
            category = await CategoryService.create_category(db, cat_data)
            created.append(category)
            print(f"✅ Created category: {category.name} ({category.slug})")
        except ValueError as e:
            print(f"⚠️  Category already exists: {cat_data.slug}")
            # Get existing
            existing = await CategoryService.get_by_slug(db, cat_data.slug)
            created.append(existing)
    
    await db.commit()
    return created


async def seed_terms(db: AsyncSession, categories: list[Category]):
    """Seed sample terms"""
    
    # Find categories by slug
    it_category = next(c for c in categories if c.slug == "it-texnologiyalari")
    prog_category = next(c for c in categories if c.slug == "dasturlash")
    ai_category = next(c for c in categories if c.slug == "sun-iy-intellekt")
    
    terms_data = [
        TermCreate(
            keyword="API",
            category_id=it_category.id,
            definitions=[
                DefinitionCreate(
                    language="uz",
                    text="Dasturiy ta'minot interfeysi - dasturlar o'zaro ma'lumot almashishi uchun ishlatiladigan vositalar to'plami",
                    example="Ushbu loyiha RESTful API orqali ishlaydi."
                ),
                DefinitionCreate(
                    language="en",
                    text="Application Programming Interface - a set of tools for software to communicate with each other",
                    example="This project uses a RESTful API."
                ),
                DefinitionCreate(
                    language="ru",
                    text="Программный интерфейс приложения - набор инструментов для взаимодействия программ",
                    example="Этот проект использует RESTful API."
                )
            ]
        ),
        TermCreate(
            keyword="Database",
            category_id=it_category.id,
            definitions=[
                DefinitionCreate(
                    language="uz",
                    text="Ma'lumotlar bazasi - ma'lumotlarni tashkil qilish va saqlash tizimi",
                    example="PostgreSQL kuchli relyatsion ma'lumotlar bazasi."
                ),
                DefinitionCreate(
                    language="en",
                    text="A structured collection of data stored and accessed electronically",
                    example="PostgreSQL is a powerful relational database."
                ),
                DefinitionCreate(
                    language="ru",
                    text="База данных - система организации и хранения данных",
                    example="PostgreSQL - мощная реляционная база данных."
                )
            ]
        ),
        TermCreate(
            keyword="Variable",
            category_id=prog_category.id,
            definitions=[
                DefinitionCreate(
                    language="uz",
                    text="O'zgaruvchi - qiymat saqlash uchun nom berilgan joy",
                    example="x = 10  # x o'zgaruvchiga 10 qiymatini berish"
                ),
                DefinitionCreate(
                    language="en",
                    text="A named location in memory that stores a value",
                    example="x = 10  # Assign value 10 to variable x"
                ),
                DefinitionCreate(
                    language="ru",
                    text="Переменная - именованное место в памяти для хранения значения",
                    example="x = 10  # Присвоить значение 10 переменной x"
                )
            ]
        ),
        TermCreate(
            keyword="Machine Learning",
            category_id=ai_category.id,
            definitions=[
                DefinitionCreate(
                    language="uz",
                    text="Mashina o'rganish - kompyuterga ma'lumotlardan o'rganish qobiliyatini beruvchi texnologiya",
                    example="Tasvir tanish dasturlari mashina o'rganishdan foydalanadi."
                ),
                DefinitionCreate(
                    language="en",
                    text="A type of artificial intelligence that enables computers to learn from data",
                    example="Image recognition systems use machine learning."
                ),
                DefinitionCreate(
                    language="ru",
                    text="Машинное обучение - технология, позволяющая компьютерам учиться на данных",
                    example="Системы распознавания изображений используют машинное обучение."
                )
            ]
        ),
    ]
    
    for term_data in terms_data:
        try:
            term = await TermService.create_term(
                db=db,
                term_data=term_data,
                user_id=None  # System-created
            )
            print(f"✅ Created term: {term.keyword}")
        except ValueError as e:
            print(f"⚠️  Term already exists: {term_data.keyword}")
    
    await db.commit()


async def main():
    """Main seed function"""
    print("🌱 Starting database seeding...\n")
    
    async with async_session_maker() as db:
        try:
            # Seed categories
            print("📁 Seeding categories...")
            categories = await seed_categories(db)
            print()
            
            # Seed terms
            print("📝 Seeding terms...")
            await seed_terms(db, categories)
            print()
            
            print("✅ Database seeding completed successfully!")
            
        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(main())
