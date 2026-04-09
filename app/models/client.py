import enum
from datetime import datetime
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class ClientGrade(str, enum.Enum):
    new = "new"
    regular = "regular"
    key_account = "key_account"

class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    bitrix_contact_id: Mapped[int | None] = mapped_column(default=None)
    name: Mapped[str] = mapped_column()
    phone: Mapped[str | None] = mapped_column(default=None)
    email: Mapped[str | None] = mapped_column(default=None)
    telegram_id: Mapped[str | None] = mapped_column(default=None)
    grade: Mapped[ClientGrade] = mapped_column()
    
    assigned_manager_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), default=None)
    orders_count: Mapped[int] = mapped_column(default=0)
    revenue: Mapped[float] = mapped_column(default=0.0)
    last_contact_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)

    chats: Mapped[list["Chat"]] = relationship("Chat", back_populates="client")
    assigned_manager: Mapped["User"] = relationship("User")
