from pydantic import BaseModel, ConfigDict
from app.models.chat import ChatChannel, ChatStatus

class ChatBase(BaseModel):
    client_id: int
    manager_id: int
    channel: ChatChannel
    status: ChatStatus = ChatStatus.open

class ChatCreate(ChatBase):
    pass

class ChatUpdate(BaseModel):
    client_id: int | None = None
    manager_id: int | None = None
    channel: ChatChannel | None = None
    status: ChatStatus | None = None

class ChatResponse(ChatBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
