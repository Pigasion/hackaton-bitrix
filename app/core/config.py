from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    BITRIX_WEBHOOK_URL: str
    GEMINI_API_KEY: str
    TELEGRAM_BOT_TOKEN: str
    WEBHOOK_DOMAIN: str = "https://your-ngrok-domain.ngrok-free.app"

    # Populated automatically by the validator below — do not set in .env
    DATABASE_USE_SSL: bool = False

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """
        Converts a generic postgresql:// URL to the asyncpg dialect.
        Strips psycopg2-only query params (sslmode, channel_binding) that
        asyncpg does not understand.
        """
        # Fix scheme
        if v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql+asyncpg://", 1)

        # Strip unsupported asyncpg URL query params
        parsed = urlparse(v)
        params = parse_qs(parsed.query, keep_blank_values=True)
        # Remove psycopg2-only params
        params.pop("sslmode", None)
        params.pop("channel_binding", None)
        clean_query = urlencode({k: v_list[0] for k, v_list in params.items()})
        clean_url = urlunparse(parsed._replace(query=clean_query))
        return clean_url

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
