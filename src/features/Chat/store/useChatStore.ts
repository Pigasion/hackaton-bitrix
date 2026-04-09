// src/store/useChatStore.ts
import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Record<string, Message[]>;
  isForwardModalOpen: boolean;
  selectedMessageId: string | null;
  sourceChatId: string | null;

  // Actions
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  openForwardModal: (messageId: string, chatId: string) => void;
  closeForwardModal: () => void;
  forwardMessage: (payload: {
    messageId: string;
    fromChatId: string;
    toChatId: string;
    comment?: string;
  }) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  isForwardModalOpen: false,
  selectedMessageId: null,
  sourceChatId: null,

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),

  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),

  openForwardModal: (messageId, chatId) =>
    set({
      isForwardModalOpen: true,
      selectedMessageId: messageId,
      sourceChatId: chatId,
    }),

  closeForwardModal: () =>
    set({
      isForwardModalOpen: false,
      selectedMessageId: null,
      sourceChatId: null,
    }),

  forwardMessage: async (payload) => {
    try {
      // Имитация API вызова
      await new Promise((resolve) => setTimeout(resolve, 500));

      const forwardedMessage: Message = {
        id: `fwd_${Date.now()}`,
        chatId: payload.toChatId,
        text: payload.comment
          ? `${payload.comment}\n\n---\nПересланное сообщение`
          : `---\nПересланное сообщение`,
        direction: 'incoming',
        timestamp: new Date().toISOString(),
        status: 'sent',
        forwardedFrom: {
          messageId: payload.messageId,
          originalChatId: payload.fromChatId,
          originalSender: 'Клиент',
        },
      };

      get().addMessage(payload.toChatId, forwardedMessage);
      get().closeForwardModal();
    } catch (error) {
      console.error('Failed to forward message:', error);
      throw error;
    }
  },
}));