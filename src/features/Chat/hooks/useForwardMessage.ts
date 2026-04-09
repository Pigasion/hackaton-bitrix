// src/features/Chat/hooks/useForwardMessage.ts
import { useCallback } from 'react';
import { useChatStore } from '../store/useChatStore.ts';
import { ForwardMessagePayload } from '../types';

export const useForwardMessage = () => {
  const {
    isForwardModalOpen,
    selectedMessageId,
    sourceChatId,
    openForwardModal,
    closeForwardModal,
    forwardMessage,
  } = useChatStore();

  const handleForward = useCallback(
    async (payload: Omit<ForwardMessagePayload, 'messageId' | 'fromChatId'>) => {
      if (!selectedMessageId || !sourceChatId) return;

      await forwardMessage({
        messageId: selectedMessageId,
        fromChatId: sourceChatId,
        ...payload,
      });
    },
    [selectedMessageId, sourceChatId, forwardMessage]
  );

  return {
    isForwardModalOpen,
    selectedMessageId,
    sourceChatId,
    openForwardModal,
    closeForwardModal,
    handleForward,
  };
};