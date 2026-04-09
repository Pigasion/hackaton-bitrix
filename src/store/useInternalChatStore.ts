// src/store/useInternalChatStore.ts
import { create } from 'zustand';

export interface InternalMessage {
  id: string;
  department: 'economist' | 'logistics' | 'production' | 'all';
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  isForwarded?: boolean;
  forwardedFrom?: {
    clientId: string;
    clientName: string;
    originalMessageId: string;
  };
}

interface InternalChatState {
  messages: Record<string, InternalMessage[]>;
  addMessage: (department: string, message: InternalMessage) => void;
  getMessages: (department: string) => InternalMessage[];
}

export const useInternalChatStore = create<InternalChatState>((set, get) => ({
  messages: {
    economist: [],
    logistics: [],
    production: [],
    all: [],
  },

  addMessage: (department, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [department]: [...(state.messages[department] || []), message],
      },
    })),

  getMessages: (department) => get().messages[department] || [],
}));