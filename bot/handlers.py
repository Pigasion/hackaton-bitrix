import json
import logging
from aiogram import Router, types
from aiogram.filters import CommandStart
from sqlalchemy import select

from app.core.database import async_session_maker
from app.models.client import Client, ClientGrade
from app.models.chat import Chat, ChatChannel, ChatStatus
from app.models.message import Message, SenderType
from app.services.routing import assign_manager_to_chat
from app.services.bitrix import bitrix_client
from app.api.v1.ws import manager as ws_manager
from bot.main import dp

logger = logging.getLogger(__name__)

router = Router()

@router.message()
async def handle_all_messages(message: types.Message):
    """
    Catch-all text handler for incoming Telegram messages.
    """
    if not message.text:
        return
        
    telegram_id = str(message.from_user.id)
    text = message.text
    client_name = message.from_user.full_name or f"TG User {telegram_id}"

    async with async_session_maker() as session:
        # 1. Find client by Telegram ID
        query = select(Client).where(Client.telegram_id == telegram_id)
        result = await session.execute(query)
        client = result.scalars().first()

        # 2. If client does not exist
        if not client:
            client = Client(
                name=client_name,
                telegram_id=telegram_id,
                grade=ClientGrade.new
            )
            session.add(client)
            await session.flush()
            
            # Create lead in Bitrix24
            lead_data = {
                "TITLE": f"Новое обращение из Telegram: {client_name}",
                "NAME": client_name,
                "OPENED": "Y"
            }
            try:
                await bitrix_client.create_lead(lead_data)
            except Exception as e:
                logger.error(f"Failed to create Bitrix24 lead for TG {telegram_id}: {e}")

        # 3. Determine Responsible Manager
        manager = await assign_manager_to_chat(client, session)

        # 4. Find or Create Active Chat
        chat_query = select(Chat).where(
            Chat.client_id == client.id,
            Chat.status == ChatStatus.open,
            Chat.channel == ChatChannel.telegram
        )
        chat_result = await session.execute(chat_query)
        chat = chat_result.scalars().first()

        if not chat:
            chat = Chat(
                client_id=client.id,
                manager_id=manager.id,
                channel=ChatChannel.telegram,
                status=ChatStatus.open
            )
            session.add(chat)
            await session.flush()

        # 5. Save the Message
        new_msg = Message(
            chat_id=chat.id,
            sender_type=SenderType.client,
            text=text
        )
        session.add(new_msg)
        await session.commit()
        await session.refresh(new_msg)

        # 6. Notify the manager via WebSockets
        notification = {
            "type": "new_message",
            "chat_id": chat.id,
            "message_id": new_msg.id,
            "client_name": client.name,
            "text": text,
            "channel": "telegram"
        }
        await ws_manager.send_personal_message(json.dumps(notification), str(manager.id))

# Bind router to dispatcher
dp.include_router(router)
