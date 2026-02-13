from pydantic_settings import BaseSettings
from pydantic import SecretStr

class BotSettings(BaseSettings):
    BOT_TOKEN: SecretStr
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

bot_settings = BotSettings()
