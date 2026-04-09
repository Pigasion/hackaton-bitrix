import enum
from datetime import datetime
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class SenderType(str, enum.Enum):
    client = "client"
    manager = "manager"
    ai_prompt = "ai_prompt"

class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id"))
    sender_type: Mapped[SenderType] = mapped_column()
    text: Mapped[str | None] = mapped_column(default=None)
    file_url: Mapped[str | None] = mapped_column(default=None)
    file_name: Mapped[str | None] = mapped_column(default=None)
    file_type: Mapped[str | None] = mapped_column(default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    chat: Mapped["Chat"] = relationship("Chat", back_populates="messages")
