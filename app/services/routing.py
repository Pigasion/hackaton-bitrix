import logging
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.client import Client, ClientGrade
from app.models.user import User, UserRole, UserGrade
from app.services.bitrix import bitrix_client
from app.services.ai_gemini import is_technical_request

logger = logging.getLogger(__name__)

async def assign_manager_to_chat(client: Client, session: AsyncSession) -> User:
    """
    Assigns the optimal manager to a chat based on client grade.
    - key_account -> Head or Top Manager
    - regular/new -> Active Seller with min active_chats_count
    """
    if client.assigned_manager_id:
        manager = await session.get(User, client.assigned_manager_id)
        if manager:
            return manager

    # Logic based on Grade defined in project.md
    if client.grade == ClientGrade.key_account:
        # Route to Top-Manager or Head
        query = select(User).where(or_(User.grade == UserGrade.top, User.role == UserRole.head)).order_by(User.active_chats_count.asc())
        result = await session.execute(query)
        manager = result.scalars().first()
    else:
        # Regular or New clients -> Active seller with min chats
        query = select(User).where(User.role == UserRole.active_seller).order_by(User.active_chats_count.asc())
        result = await session.execute(query)
        manager = result.scalars().first()

    # Ultimate fallback to any active user if specific roles are missing
    if not manager:
        query = select(User).order_by(User.active_chats_count.asc())
        result = await session.execute(query)
        manager = result.scalars().first()

    if manager:
        # Assign logic and bump counter
        client.assigned_manager_id = manager.id
        manager.active_chats_count += 1
        await session.flush()

    return manager

async def check_technical_involvement(session: AsyncSession, text: Optional[str]) -> Optional[User]:
    if not text:
        return None
        
    is_tech = await is_technical_request(text)
    if is_tech:
        query = select(User).where(User.role == UserRole.technologist).order_by(User.active_chats_count.asc())
        result = await session.execute(query)
        tech_manager = result.scalars().first()
        return tech_manager
        
    return None
