from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.api.deps import get_session
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageUpdate, MessageResponse

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.get("/", response_model=List[MessageResponse])
async def get_messages(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    stmt = select(Message).offset(skip).limit(limit)
    result = await session.execute(stmt)
    return result.scalars().all()

@router.get("/{message_id}", response_model=MessageResponse)
async def get_message(message_id: int, session: AsyncSession = Depends(get_session)):
    message = await session.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return message

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(message_in: MessageCreate, session: AsyncSession = Depends(get_session)):
    message = Message(**message_in.model_dump())
    session.add(message)
    await session.commit()
    await session.refresh(message)
    return message

@router.patch("/{message_id}", response_model=MessageResponse)
async def update_message(
    message_id: int,
    message_in: MessageUpdate,
    session: AsyncSession = Depends(get_session)
):
    message = await session.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    
    update_data = message_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(message, field, value)
        
    session.add(message)
    await session.commit()
    await session.refresh(message)
    return message

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: int, session: AsyncSession = Depends(get_session)):
    message = await session.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    
    await session.delete(message)
    await session.commit()
