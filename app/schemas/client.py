import re
from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from app.models.client import ClientGrade


def normalize_phone(value: str | None) -> str | None:
    """
    Normalizes a phone number to strict international format (+7XXXXXXXXXX).
    - Strips spaces, dashes, parentheses, dots.
    - Replaces leading '8' with '+7'.
    - Raises ValueError if the result is not 12 chars in +7XXXXXXXXXX format.
    """
    if value is None:
        return None

    # Remove formatting chars
    cleaned = re.sub(r"[\s\-\(\)\.]", "", value)

    # Replace leading '8' with '+7'
    if cleaned.startswith("8") and len(cleaned) == 11:
        cleaned = "+7" + cleaned[1:]

    # Validate: must be +7 followed by exactly 10 digits
    if not re.fullmatch(r"\+7\d{10}", cleaned):
        raise ValueError(
            f"Invalid phone number '{value}'. "
            "Expected international format, e.g. +79001234567"
        )

    return cleaned


class ClientBase(BaseModel):
    bitrix_contact_id: int | None = None
    name: str
    phone: str | None = None
    email: str | None = None
    telegram_id: str | None = None
    grade: ClientGrade
    assigned_manager_id: int | None = None
    orders_count: int = 0
    revenue: float = 0.0
    last_contact_at: datetime | None = None

    @field_validator("phone", mode="before")
    @classmethod
    def validate_phone(cls, v: str | None) -> str | None:
        return normalize_phone(v)


class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    bitrix_contact_id: int | None = None
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    telegram_id: str | None = None
    grade: ClientGrade | None = None
    assigned_manager_id: int | None = None
    orders_count: int | None = None
    revenue: float | None = None
    last_contact_at: datetime | None = None

    @field_validator("phone", mode="before")
    @classmethod
    def validate_phone(cls, v: str | None) -> str | None:
        return normalize_phone(v)

class ClientResponse(ClientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
