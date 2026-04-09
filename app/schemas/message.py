from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.message import SenderType

class MessageBase(BaseModel):
    chat_id: int
    sender_type: SenderType
    text: str | None = None
    file_url: str | None = None
    file_name: str | None = None
    file_type: str | None = None

class MessageCreate(MessageBase):
    pass

class MessageUpdate(BaseModel):
    sender_type: SenderType | None = None
    text: str | None = None
    file_url: str | None = None
    file_name: str | None = None
    file_type: str | None = None

class MessageResponse(MessageBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
