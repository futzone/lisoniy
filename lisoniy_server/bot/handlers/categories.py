from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from sqlalchemy import select, func
from bot.keyboards import get_categories_kb
from app.models.terminology import Category
from bot.states import AddCategoryState
from slugify import slugify
from redis.asyncio import Redis

router = Router()

@router.message(F.text == "📚 Atamalar katalogi")
async def show_categories(message: Message, db):
    await list_categories(message, db)

@router.message(F.text == "📝 Atama qo'shish")
async def add_term_menu_click(message: Message, db):
    await message.answer("Atama qo'shish uchun avval kategoriyani tanlang:")
    await list_categories(message, db)

async def list_categories(message: Message, db):
    # Pagination logic needed
    count = await db.scalar(select(func.count()).select_from(Category))
    stmt = select(Category).limit(10)
    result = await db.execute(stmt)
    cats = result.scalars().all()
    
    total_pages = (count + 9) // 10
    
    await message.answer("Kategoriyalar:", reply_markup=get_categories_kb(cats, 1, total_pages))

@router.callback_query(F.data == "add_category")
async def add_category_start(call: CallbackQuery, state: FSMContext):
    await call.message.answer("Kategoriya nomini kiriting:")
    await state.set_state(AddCategoryState.name)
    await call.answer()

@router.message(AddCategoryState.name)
async def process_cat_name(message: Message, state: FSMContext):
    await state.update_data(name=message.text)
    await message.answer("Kategoriya tavsifini kiriting (yoki 'skip'):")
    await state.set_state(AddCategoryState.description)

@router.message(AddCategoryState.description)
async def process_cat_desc(message: Message, state: FSMContext, db):
    desc = message.text
    if desc.lower() == 'skip': desc = None
    
    data = await state.get_data()
    name = data['name']
    slug = slugify(name)
    
    cat = Category(name=name, slug=slug, description=desc)
    db.add(cat)
    try:
        await db.commit()
        
        # Clear API Cache
        try:
            redis = Redis(host='redis', port=6379, db=0)
            await redis.delete("categories:all")
            await redis.close()
        except Exception as r_err:
            print(f"Redis Error: {r_err}")
            
        await message.answer("Kategoriya qo'shildi!")
    except Exception as e:
        await db.rollback()
        await message.answer(f"Xatolik: {e}")
        
    await state.clear()
