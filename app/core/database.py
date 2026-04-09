import ssl
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# asyncpg requires SSL to be passed via connect_args, not as a URL query param.
# We detect whether the original .env URL had sslmode=require and configure accordingly.
_raw_url = settings.DATABASE_URL  # already cleaned by validator
_needs_ssl = "sslmode=require" in (settings.model_config.get("env_file", "") or "") or \
             "neon.tech" in _raw_url  # Neon always requires SSL

_connect_args: dict = {}
if _needs_ssl:
    _ssl_ctx = ssl.create_default_context()
    _connect_args["ssl"] = _ssl_ctx

engine = create_async_engine(settings.DATABASE_URL, echo=True, connect_args=_connect_args)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass
