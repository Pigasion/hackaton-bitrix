from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.client import ClientGrade

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

class ClientResponse(ClientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
