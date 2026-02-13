from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

def get_main_menu():
    kb = [
        [KeyboardButton(text="📚 Atamalar katalogi"), KeyboardButton(text="📝 Atama qo'shish")],
        [KeyboardButton(text="👤 Profil"), KeyboardButton(text="🚪 Chiqish")]
    ]
    return ReplyKeyboardMarkup(keyboard=kb, resize_keyboard=True)

def get_categories_kb(categories, page=1, total_pages=1):
    builder = InlineKeyboardBuilder()
    
    for cat in categories:
        builder.button(text=cat.name, callback_data=f"cat_{cat.id}")
    
    builder.adjust(2)
    
    nav_buttons = []
    if page > 1:
        nav_buttons.append(InlineKeyboardButton(text="⬅️ Oldingi", callback_data=f"cats_page_{page-1}"))
    if page < total_pages:
        nav_buttons.append(InlineKeyboardButton(text="Keyingi ➡️", callback_data=f"cats_page_{page+1}"))
        
    if nav_buttons:
        builder.row(*nav_buttons)
        
    builder.row(InlineKeyboardButton(text="➕ Kategoriya qo'shish", callback_data="add_category"))
    
    return builder.as_markup()
