from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message
from aiogram.fsm.context import FSMContext
from sqlalchemy import select
from passlib.context import CryptContext

from bot.states import LoginState
from bot.keyboards import get_main_menu
from app.models.user import User

router = Router()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    await message.answer("Assalomu alaykum! Lisoniy botiga xush kelibsiz.\nIltimos, email manzilingizni kiriting:")
    await state.set_state(LoginState.email)

@router.message(LoginState.email)
async def process_email(message: Message, state: FSMContext):
    await state.update_data(email=message.text)
    await message.answer("Parolni kiriting:")
    await state.set_state(LoginState.password)

@router.message(LoginState.password)
async def process_password(message: Message, state: FSMContext, db):
    password = message.text
    # Delete password message for security
    try:
        await message.delete()
    except:
        pass
        
    data = await state.get_data()
    email = data.get("email")
    
    # Check DB
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user or not pwd_context.verify(password, user.hashed_password):
        await message.answer("Email yoki parol noto'g'ri. Qaytadan /start bosing.")
        await state.clear()
        return

    # Success
    await state.update_data(user_id=user.id)
    await message.answer(f"Xush kelibsiz, {user.full_name or 'Foydalanuvchi'}!", reply_markup=get_main_menu())
    await state.set_state(None) # Clear state but keep data if needed? No, FSM data is cleared on finish usually. 
    # Usually we store user_id in persistent storage (Redis) keyed by telegram_id if we want "remember me".
    # For now session based. If bot restarts, login needed?
    # Aiogram FSM (Redis) keeps state.
