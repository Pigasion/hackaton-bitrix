from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter(prefix="/ws", tags=["WebSockets"])

class ConnectionManager:
    def __init__(self):
        # Храним активные соединения для каждого клиента (ID менеджера или клиента)
        # В реальном приложении это может быть более сложная структура (Redis PubSub)
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_personal_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Ожидаем сообщения (например, ping от клиента или команды)
            data = await websocket.receive_text()
            # Для эхо-тестирования или обработки поступающих команд:
            await manager.send_personal_message(f"You wrote: {data}", client_id)
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        # Опционально: оповестить других пользователей об отключении участника
        # await manager.broadcast(f"Client #{client_id} left the chat")
