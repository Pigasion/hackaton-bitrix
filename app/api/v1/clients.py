from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.api.deps import get_session
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/", response_model=List[ClientResponse])
async def get_clients(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    stmt = select(Client).offset(skip).limit(limit)
    result = await session.execute(stmt)
    return result.scalars().all()

@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: int, session: AsyncSession = Depends(get_session)):
    client = await session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return client

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(client_in: ClientCreate, session: AsyncSession = Depends(get_session)):
    client = Client(**client_in.model_dump())
    session.add(client)
    await session.commit()
    await session.refresh(client)
    return client

@router.patch("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int,
    client_in: ClientUpdate,
    session: AsyncSession = Depends(get_session)
):
    client = await session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    update_data = client_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
        
    session.add(client)
    await session.commit()
    await session.refresh(client)
    return client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(client_id: int, session: AsyncSession = Depends(get_session)):
    client = await session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    await session.delete(client)
    await session.commit()
