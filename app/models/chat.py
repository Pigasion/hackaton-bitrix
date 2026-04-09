import enum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class ChatChannel(str, enum.Enum):
    telegram = "telegram"
    email = "email"
    call = "call"

class ChatStatus(str, enum.Enum):
    open = "open"
    closed = "closed"

class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    manager_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    channel: Mapped[ChatChannel] = mapped_column()
    status: Mapped[ChatStatus] = mapped_column(default=ChatStatus.open)

    client: Mapped["Client"] = relationship("Client", back_populates="chats")
    manager: Mapped["User"] = relationship("User", back_populates="chats")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="chat")
