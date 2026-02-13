import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.redis import RedisStorage
from redis.asyncio import Redis

from bot.config import bot_settings
from bot.handlers import auth, categories, terms
from bot.middlewares import DbSessionMiddleware

# Import all models to ensure SQLAlchemy registry is populated
from app.models.user import User
from app.models.user_meta import UserMeta
from app.models.post import Post
from app.models.dataset import Dataset
from app.models.dataset_meta import DatasetMeta
from app.models.terminology import Category, Term, Definition

# Configure logging
logging.basicConfig(level=logging.INFO)

async def main():
    # Redis for FSM
    redis = Redis(host='redis', port=6379, db=1)
    storage = RedisStorage(redis=redis)
    
    bot = Bot(token=bot_settings.BOT_TOKEN.get_secret_value())
    dp = Dispatcher(storage=storage)
    
    # Middleware
    dp.message.middleware(DbSessionMiddleware())
    dp.callback_query.middleware(DbSessionMiddleware())
    
    # Routers
    dp.include_router(auth.router)
    dp.include_router(categories.router)
    dp.include_router(terms.router)
    
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
