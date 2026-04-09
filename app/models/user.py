import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    head = "head"
    active_seller = "active_seller"
    technologist = "technologist"
    economist = "economist"
    dispatcher = "dispatcher"

class UserGrade(str, enum.Enum):
    trainee = "trainee"
    middle = "middle"
    top = "top"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    bitrix_id: Mapped[int | None] = mapped_column(default=None)
    name: Mapped[str] = mapped_column()
    role: Mapped[UserRole] = mapped_column()
    grade: Mapped[UserGrade] = mapped_column()
    active_chats_count: Mapped[int] = mapped_column(default=0)
    is_active: Mapped[bool] = mapped_column(default=True)

    chats: Mapped[list["Chat"]] = relationship("Chat", back_populates="manager")
