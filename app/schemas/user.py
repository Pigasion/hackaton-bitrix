from pydantic import BaseModel, ConfigDict
from app.models.user import UserRole, UserGrade

class UserBase(BaseModel):
    bitrix_id: int | None = None
    name: str
    role: UserRole
    grade: UserGrade
    active_chats_count: int = 0
    is_active: bool = True

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    bitrix_id: int | None = None
    name: str | None = None
    role: UserRole | None = None
    grade: UserGrade | None = None
    active_chats_count: int | None = None
    is_active: bool | None = None

class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
