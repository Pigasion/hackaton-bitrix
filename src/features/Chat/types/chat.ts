// src/features/Chat/types.ts

export type ChannelType = 'whatsapp' | 'telegram' | 'email' | 'phone' | 'viber';
export type MessageDirection = 'incoming' | 'outgoing';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  chatId: string;
  text: string;
  direction: MessageDirection;
  timestamp: string;
  status: MessageStatus;
  attachments?: string[];
  forwardedFrom?: {
    messageId: string;
    originalChatId: string;
    originalSender: string;
  };
}

export interface Chat {
  id: string;
  clientId: string;
  clientName: string;
  channel: ChannelType;
  isVip: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

export interface InternalChat {
  id: string;
  department: 'economist' | 'logistics' | 'production' | 'all';
  departmentName: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  members: number;
}

export interface ForwardMessagePayload {
  messageId: string;
  fromChatId: string;
  toChatId: string;
  comment?: string;
}