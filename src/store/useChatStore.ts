// src/store/useChatStore.ts
import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Record<string, Message[]>;
  isForwardModalOpen: boolean;
  selectedMessageId: string | null;
  sourceChatId: string | null;

  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  openForwardModal: (messageId: string, chatId: string) => void;
  closeForwardModal: () => void;
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
}));