from aiogram import Bot, Dispatcher
from app.core.config import settings

# Initialize bot and dispatcher
tg_bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

# We need to import handlers to register them
from bot import handlers  # noqa: E402
