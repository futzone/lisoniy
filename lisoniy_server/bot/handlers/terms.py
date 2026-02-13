from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.fsm.context import FSMContext
from sqlalchemy import select, func
from bot.states import AddTermState
from app.models.terminology import Term, Category, Definition

router = Router()

def get_terms_nav_kb(category_id, page=1, total_pages=1):
    builder = InlineKeyboardBuilder()
    
    nav_buttons = []
    if page > 1:
        nav_buttons.append(InlineKeyboardButton(text="⬅️ Oldingi", callback_data=f"terms_page_{category_id}_{page-1}"))
    if page < total_pages:
        nav_buttons.append(InlineKeyboardButton(text="Keyingi ➡️", callback_data=f"terms_page_{category_id}_{page+1}"))
        
    if nav_buttons:
        builder.row(*nav_buttons)
        
    builder.row(InlineKeyboardButton(text="➕ Atama qo'shish", callback_data=f"add_term_{category_id}"))
    builder.row(InlineKeyboardButton(text="🔙 Kategoriyalarga qaytish", callback_data="back_to_cats"))
    
    return builder.as_markup()

@router.callback_query(F.data.startswith("cat_"))
async def show_terms(call: CallbackQuery, db):
    cat_id = call.data.split("_")[1]
    page = 1
    await display_terms(call, db, cat_id, page)

@router.callback_query(F.data.startswith("terms_page_"))
async def terms_pagination(call: CallbackQuery, db):
    _, _, cat_id, page_str = call.data.split("_")
    page = int(page_str)
    await display_terms(call, db, cat_id, page)

async def display_terms(call: CallbackQuery, db, cat_id, page):
    # Get Category Name
    cat = await db.get(Category, cat_id)
    if not cat:
        await call.answer("Kategoriya topilmadi")
        return

    # Count terms
    count = await db.scalar(select(func.count()).select_from(Term).where(Term.category_id == cat_id))
    
    # Get terms
    stmt = select(Term).where(Term.category_id == cat_id).limit(10).offset((page-1)*10)
    result = await db.execute(stmt)
    terms = result.scalars().all()
    
    total_pages = (count + 9) // 10
    
    # Format text
    text = f"📂 Kategoriya: <b>{cat.name}</b>\nJami atamalar: {count} ta (Sahifa: {page}/{total_pages})\n\n"
    
    if not terms:
        text += "<i>Hozircha atamalar yo'q.</i>"
    else:
        for idx, term in enumerate(terms, start=(page-1)*10 + 1):
            text += f"{idx}. <b>{term.keyword}</b>\n"
    
    await call.message.edit_text(
        text, 
        reply_markup=get_terms_nav_kb(cat_id, page, total_pages),
        parse_mode="HTML"
    )
    await call.answer()

# --- Add Term Flow ---

@router.callback_query(F.data.startswith("add_term_"))
async def add_term_start(call: CallbackQuery, state: FSMContext):
    cat_id = call.data.split("_")[2]
    await state.update_data(category_id=cat_id)
    await call.message.answer("📝 <b>Atama (Term) nomini kiriting:</b>\n(Masalan: Sun'iy intellekt)", parse_mode="HTML")
    await state.set_state(AddTermState.keyword)
    await call.answer()

@router.message(AddTermState.keyword)
async def process_keyword(message: Message, state: FSMContext):
    await state.update_data(keyword=message.text)
    await message.answer("🇺🇿 <b>O'zbek tilidagi ta'rifini yozing:</b>", parse_mode="HTML")
    await state.set_state(AddTermState.uz_definition)

@router.message(AddTermState.uz_definition)
async def process_uz_def(message: Message, state: FSMContext):
    await state.update_data(uz_definition=message.text)
    await message.answer("🇺🇿 <b>O'zbek tilida misol keltiring</b> (yoki 'skip'):", parse_mode="HTML")
    await state.set_state(AddTermState.uz_example)

@router.message(AddTermState.uz_example)
async def process_uz_ex(message: Message, state: FSMContext):
    text = message.text
    if text.lower() == 'skip': text = None
    await state.update_data(uz_example=text)
    
    await message.answer("🇬🇧 <b>Inglizcha nomini yozing:</b> (yoki 'skip' qilib o'tkazib yuboring)", parse_mode="HTML")
    await state.set_state(AddTermState.en_keyword)

@router.message(AddTermState.en_keyword)
async def process_en_keyword(message: Message, state: FSMContext):
    text = message.text
    if text.lower() == 'skip':
        # Skip all English parts
        await state.update_data(en_keyword=None, en_definition=None, en_example=None)
        await show_summary(message, state)
        return

    await state.update_data(en_keyword=text)
    await message.answer("🇬🇧 <b>Ingliz tilidagi ta'rifini yozing:</b> (yoki 'skip')", parse_mode="HTML")
    await state.set_state(AddTermState.en_definition)

@router.message(AddTermState.en_definition)
async def process_en_def(message: Message, state: FSMContext):
    text = message.text
    if text.lower() == 'skip': text = None
    await state.update_data(en_definition=text)
    
    await message.answer("🇬🇧 <b>Ingliz tilida misol keltiring</b> (yoki 'skip'):", parse_mode="HTML")
    await state.set_state(AddTermState.en_example)

@router.message(AddTermState.en_example)
async def process_en_ex(message: Message, state: FSMContext):
    text = message.text
    if text.lower() == 'skip': text = None
    await state.update_data(en_example=text)
    await show_summary(message, state)

async def show_summary(message: Message, state: FSMContext):
    data = await state.get_data()
    
    summary = (
        f"📋 <b>Ma'lumotlarni tekshiring:</b>\n\n"
        f"🔹 <b>Term:</b> {data['keyword']}\n"
        f"🇺🇿 <b>UZ:</b> {data['uz_definition']}\n"
        f"<i>Misol: {data.get('uz_example') or '-'}</i>\n"
    )
    
    if data.get('en_keyword'):
        summary += (
            f"\n🇬🇧 <b>EN:</b> {data['en_keyword']} - {data.get('en_definition') or '-'}\n"
            f"<i>Example: {data.get('en_example') or '-'}</i>"
        )
    
    kb = InlineKeyboardBuilder()
    kb.button(text="✅ Tasdiqlash", callback_data="confirm_add_term")
    kb.button(text="❌ Bekor qilish", callback_data="cancel_add_term")
    kb.adjust(2)
    
    await message.answer(summary, reply_markup=kb.as_markup(), parse_mode="HTML")
    await state.set_state(AddTermState.confirm)

@router.callback_query(AddTermState.confirm, F.data == "confirm_add_term")
async def confirm_add_term(call: CallbackQuery, state: FSMContext, db):
    data = await state.get_data()
    
    # 1. Create Term
    term = Term(
        keyword=data['keyword'],
        category_id=data['category_id']
    )
    
    db.add(term)
    await db.flush() # to get term.id
    
    # 2. Add Definitions
    # UZ
    def_uz = Definition(
        term_id=term.id,
        language="uz",
        text=data['uz_definition'],
        example=data['uz_example']
    )
    db.add(def_uz)
    
    # EN (Only if keyword provided)
    if data.get('en_keyword'):
        def_en = Definition(
            term_id=term.id,
            language="en",
            text=f"{data['en_keyword']}: {data.get('en_definition') or ''}",
            example=data.get('en_example')
        )
        db.add(def_en)
    
    try:
        await db.commit()
        await call.message.answer("✅ Muvaffaqiyatli qo'shildi!")
    except Exception as e:
        await db.rollback()
        await call.message.answer(f"❌ Xatolik: {e}")
        
    await state.clear()

@router.callback_query(AddTermState.confirm, F.data == "cancel_add_term")
async def cancel_add_term(call: CallbackQuery, state: FSMContext):
    await call.message.answer("❌ Bekor qilindi.")
    await state.clear()
