from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    BITRIX_WEBHOOK_URL: str
    GEMINI_API_KEY: str
    TELEGRAM_BOT_TOKEN: str
    WEBHOOK_DOMAIN: str = "https://your-ngrok-domain.ngrok-free.app"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
