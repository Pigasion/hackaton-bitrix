from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import engine, Base
from app.core.config import settings
from bot.main import bot

# Import models so they are registered with Base metadata before create_all
import app.models
from app.api.v1 import users, clients, chats, messages, ws, audio, webhooks

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event: create db tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Set Telegram Webhook
    webhook_url = f"{settings.WEBHOOK_DOMAIN.rstrip('/')}/api/v1/webhooks/tg-webhook/"
    await bot.set_webhook(url=webhook_url)

    yield
    
    # Shutdown event: dispose engine and delete webhook
    await bot.delete_webhook()
    await engine.dispose()

app = FastAPI(
    title="Omnichannel CRM API",
    description="Backend for Flex-N-Roll PRO",
    version="1.0.0",
    lifespan=lifespan
)

# Register all Routers
app.include_router(users.router, prefix="/api/v1")
app.include_router(clients.router, prefix="/api/v1")
app.include_router(chats.router, prefix="/api/v1")
app.include_router(messages.router, prefix="/api/v1")
app.include_router(audio.router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/v1")
app.include_router(ws.router, prefix="/api/v1")

@app.get("/")

async def root() -> dict[str, str]:
    return {"message": "Welcome to Omnichannel CRM API"}
