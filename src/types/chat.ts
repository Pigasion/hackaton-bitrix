// src/types/chat.ts

export type ChannelType = 'whatsapp' | 'telegram' | 'email' | 'phone' | 'viber' | 'max';

export type MessageDirection = 'incoming' | 'outgoing';

export interface Message {
  id: string;
  chatId: string;
  text: string;
  direction: MessageDirection;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

export interface Chat {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  channel: ChannelType;
  isVip: boolean;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  avatar?: string;
  managerId: string;
  managerName: string;
}

// src/types/internal-chat.ts
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

export interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChatId: string | null;
  isLoading: boolean;
}