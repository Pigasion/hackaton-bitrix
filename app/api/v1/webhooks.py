import logging
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_session
from app.models.chat import Chat, ChatChannel, ChatStatus
from app.models.message import Message, SenderType
from app.services.routing import route_incoming_request
from app.services.ai_gemini import generate_manager_hint
from app.api.v1.ws import manager as ws_manager
from aiogram import types
from bot.main import bot, dp

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

class IncomingMessagePayload(BaseModel):
    client_name: str = "Новый Клиент"
    phone: Optional[str] = None
    email: Optional[str] = None
    telegram_id: Optional[str] = None
    text: Optional[str] = None
    channel: ChatChannel = ChatChannel.telegram

async def ai_prompter_task(chat_id: int):
    """
    Background task to analyze the chat history and provide a manager hint via WebSockets.
    """
    from app.core.database import async_session_maker
    
    async with async_session_maker() as session:
        # Fetch last 5 messages for context
        query = select(Message).where(Message.chat_id == chat_id).order_by(Message.created_at.desc()).limit(5)
        result = await session.execute(query)
        messages = result.scalars().all()
        
        # Reverse to get chronological order
        messages.reverse()
        
        if len(messages) < 2:
            return  # Not enough context yet
            
        context_lines = [
            f"{msg.sender_type.value}: {msg.text}" 
            for msg in messages if msg.text
        ]
        
        if not context_lines:
            return

        try:
            hint_text = await generate_manager_hint(context_lines)
            
            # Save the hint to DB
            ai_msg = Message(
                chat_id=chat_id,
                sender_type=SenderType.ai_prompt,
                text=hint_text
            )
            session.add(ai_msg)
            
            # Find the manager to notify
            chat = await session.get(Chat, chat_id)
            if chat:
                await session.commit()
                # Notify manager via WebSocket
                notification = {
                    "type": "ai_hint",
                    "chat_id": chat_id,
                    "text": hint_text
                }
                await ws_manager.send_personal_message(
                    json.dumps(notification), 
                    str(chat.manager_id)
                )
        except Exception as e:
            logger.error(f"Error in AI Prompter Task: {e}")

@router.post("/incoming/")
async def handle_incoming_message(
    payload: IncomingMessagePayload,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    """
    Webhook to handle incoming external messages. 
    Triggers smart routing, saves down the text, and notifies the manager.
    """
    if not any([payload.phone, payload.email, payload.telegram_id]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Must provide at least one contact method (phone, email, or telegram_id)"
        )

    # 1. Smart Routing: Get/Create Client and Assign Manager
    client, primary_manager, technologist = await route_incoming_request(
        session=session,
        phone=payload.phone,
        email=payload.email,
        telegram_id=payload.telegram_id,
        text=payload.text,
        client_name=payload.client_name
    )

    # 2. Get or Create an active Chat
    query = select(Chat).where(
        Chat.client_id == client.id, 
        Chat.status == ChatStatus.open,
        Chat.channel == payload.channel
    )
    result = await session.execute(query)
    chat = result.scalars().first()

    if not chat:
        chat = Chat(
            client_id=client.id,
            manager_id=primary_manager.id,
            channel=payload.channel,
            status=ChatStatus.open
        )
        session.add(chat)
        await session.flush()  # To get chat.id

    # 3. Create the Message
    msg = Message(
        chat_id=chat.id,
        sender_type=SenderType.client,
        text=payload.text
    )
    session.add(msg)
    await session.commit()
    await session.refresh(msg)

    # 4. Notify Manager via WebSockets
    notification = {
        "type": "new_message",
        "chat_id": chat.id,
        "message_id": msg.id,
        "client_name": client.name,
        "text": msg.text,
        "technologist_added": technologist.name if technologist else None
    }
    await ws_manager.send_personal_message(json.dumps(notification), str(primary_manager.id))

    if technologist and technologist.id != primary_manager.id:
         # Optionally notify technologist too
         await ws_manager.send_personal_message(json.dumps(notification), str(technologist.id))

    # 5. Trigger AI Prompter in background to potentially generate a hint
    background_tasks.add_task(ai_prompter_task, chat.id)

    return {"status": "success", "chat_id": chat.id, "message_id": msg.id}

@router.post("/tg-webhook/")
async def tg_webhook(update: dict):
    """
    Webhook endpoint for receiving Telegram bot updates.
    """
    telegram_update = types.Update(**update)
    await dp.feed_update(bot=bot, update=telegram_update)
    return {"status": "ok"}
