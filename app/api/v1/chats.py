from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.api.deps import get_session
from app.models.chat import Chat
from app.schemas.chat import ChatCreate, ChatUpdate, ChatResponse

router = APIRouter(prefix="/chats", tags=["Chats"])

@router.get("/", response_model=List[ChatResponse])
async def get_chats(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    stmt = select(Chat).offset(skip).limit(limit)
    result = await session.execute(stmt)
    return result.scalars().all()

@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: int, session: AsyncSession = Depends(get_session)):
    chat = await session.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    return chat

@router.post("/", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(chat_in: ChatCreate, session: AsyncSession = Depends(get_session)):
    chat = Chat(**chat_in.model_dump())
    session.add(chat)
    await session.commit()
    await session.refresh(chat)
    return chat

@router.patch("/{chat_id}", response_model=ChatResponse)
async def update_chat(
    chat_id: int,
    chat_in: ChatUpdate,
    session: AsyncSession = Depends(get_session)
):
    chat = await session.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    
    update_data = chat_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(chat, field, value)
        
    session.add(chat)
    await session.commit()
    await session.refresh(chat)
    return chat

@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(chat_id: int, session: AsyncSession = Depends(get_session)):
    chat = await session.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    
    await session.delete(chat)
    await session.commit()
