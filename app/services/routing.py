import logging
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.client import Client, ClientGrade
from app.models.user import User, UserRole, UserGrade
from app.services.bitrix import bitrix_client
from app.services.ai_gemini import is_technical_request

logger = logging.getLogger(__name__)

async def route_incoming_request(
    session: AsyncSession,
    phone: Optional[str] = None,
    email: Optional[str] = None,
    telegram_id: Optional[str] = None,
    text: Optional[str] = None,
    client_name: str = "Новый Клиент",
) -> Tuple[Client, User, Optional[User]]:
    """
    Main entry point for smart routing of incoming messages/webhooks.
    1. Search for client in local DB (by TG ID, Phone, or Email).
    2. If not found, search in Bitrix24.
    3. If found in Bitrix, create local client.
    4. If not found anywhere, create local client as 'new' grade.
    5. Assign optimal manager (Primary).
    6. Check if technologist is needed.
    """
    client = None

    # 1. Search Local DB
    if telegram_id:
        client = (await session.execute(select(Client).where(Client.telegram_id == telegram_id))).scalars().first()
    
    if not client and phone:
        client = (await session.execute(select(Client).where(Client.phone == phone))).scalars().first()
        
    if not client and email:
        client = (await session.execute(select(Client).where(Client.email == email))).scalars().first()

    # 2. Search Bitrix24 if not in local DB
    if not client:
        identifier = phone or email
        bitrix_contact = None
        if identifier:
            bitrix_contact = await bitrix_client.find_contact_by_phone_or_email(identifier)
        
        if bitrix_contact:
            # Create local client from Bitrix data
            client = Client(
                name=f"{bitrix_contact.get('NAME', '')} {bitrix_contact.get('LAST_NAME', '')}".strip() or client_name,
                phone=phone,
                email=email,
                bitrix_contact_id=int(bitrix_contact.get('ID')),
                grade=ClientGrade.regular # Default to regular if from Bitrix
            )
            session.add(client)
            await session.flush()
        else:
            # 3. Create fresh new client
            client = Client(
                name=client_name,
                phone=phone,
                email=email,
                telegram_id=telegram_id,
                grade=ClientGrade.new
            )
            session.add(client)
            await session.flush()
            
            # Create Lead in Bitrix for new client
            lead_data = {
                "TITLE": f"Новый Лид: {client_name}",
                "NAME": client_name,
                "PHONE": phone or "",
                "EMAIL": email or "",
            }
            try:
                await bitrix_client.create_lead(lead_data)
            except Exception as e:
                logger.error(f"Failed to create Bitrix24 lead: {e}")

    # 4. Assign Manager
    primary_manager = await assign_manager_to_chat(client, session)

    # 5. Check if Tech support is needed
    technologist = await check_technical_involvement(session, text)

    return client, primary_manager, technologist


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
    """
    Checks if a request is technical and assigns a technologist if so.
    """
    if not text:
        return None
        
    is_tech = await is_technical_request(text)
    if is_tech:
        query = select(User).where(User.role == UserRole.technologist).order_by(User.active_chats_count.asc())
        result = await session.execute(query)
        tech_manager = result.scalars().first()
        return tech_manager
        
    return None
