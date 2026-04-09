from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import engine, Base
from app.core.config import settings

# Import models so they are registered with Base metadata before create_all
import app.models
from app.api.v1 import users, clients, chats, messages, ws

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event: create db tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown event: dispose engine
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
app.include_router(ws.router, prefix="/api/v1")

@app.get("/")

async def root() -> dict[str, str]:
    return {"message": "Welcome to Omnichannel CRM API"}
