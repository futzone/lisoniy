from aiogram.fsm.state import State, StatesGroup

class LoginState(StatesGroup):
    email = State()
    password = State()

class AddCategoryState(StatesGroup):
    name = State()
    description = State()

class AddTermState(StatesGroup):
    category_id = State()
    keyword = State()
    uz_definition = State()
    uz_example = State()
    en_keyword = State()
    en_definition = State()
    en_example = State()
    confirm = State()
