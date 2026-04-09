// src/features/Chat/api/chat.ts
import { Message, ForwardMessagePayload } from '../types';

// Мок-функция пересылки сообщения
export const forwardMessageApi = async (
  payload: ForwardMessagePayload
): Promise<Message> => {
  // Имитация API запроса
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Возвращаем новое сообщение в тех. чате
  return {
    id: `fwd_${Date.now()}`,
    chatId: payload.toChatId,
    text: payload.comment
      ? `${payload.comment}\n\n---\nПересланное сообщение:\n${payload.messageId}`
      : `---\nПересланное сообщение:\n${payload.messageId}`,
    direction: 'incoming',
    timestamp: new Date().toISOString(),
    status: 'sent',
    forwardedFrom: {
      messageId: payload.messageId,
      originalChatId: payload.fromChatId,
      originalSender: 'Клиент',
    },
  };
};