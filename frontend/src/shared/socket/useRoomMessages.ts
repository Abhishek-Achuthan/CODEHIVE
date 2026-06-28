import { useCallback, useEffect, useState } from 'react';
import * as RoomAPI from '../../api/endpoints/roomAPI';
import { toErrorMessage } from './roomErrors';
import { useRoomSocketEvent } from './roomSocketEvents';
import type { Message, RoomSnapshot, RoomSocket } from './roomTypes';

interface UseRoomMessagesOptions {
  roomId: string | null;
  socket: RoomSocket | null;
  snapshot: RoomSnapshot | null;
  isRealtimeReady: boolean;
  canWriteChat: boolean;
  canDeleteOwnChat: boolean;
  canModerateMessages: boolean;
  onError?: (message: string) => void;
  stopTyping?: () => void;
}

interface UseRoomMessagesResult {
  messages: Message[];
  sendMessage: (content: string, parentMessageId?: string) => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
}

export const useRoomMessages = ({
  roomId,
  socket,
  snapshot,
  isRealtimeReady,
  canWriteChat,
  canDeleteOwnChat,
  canModerateMessages,
  onError,
  stopTyping,
}: UseRoomMessagesOptions): UseRoomMessagesResult => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(snapshot?.roomId === roomId ? snapshot.messages : []);
  }, [roomId, snapshot]);

  const handleMessage = useCallback(
    (message: Message) => {
      if (message.roomId !== roomId) return;

      setMessages((current) => {
        if (current.some((existing) => existing.id === message.id)) return current;
        return [...current, message];
      });
    },
    [roomId]
  );

  useRoomSocketEvent(socket, 'message:created', handleMessage);

  const handleMessageEdited = useCallback((payload: { roomId: string; messageId: string; content: string }) => {
    if (payload.roomId !== roomId) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === payload.messageId
          ? { ...message, content: payload.content, isEdited: true }
          : message
      )
    );
  }, [roomId]);

  useRoomSocketEvent(socket, 'message:edited', handleMessageEdited);

  const handleMessageDeleted = useCallback((payload: { roomId: string; messageId: string }) => {
    if (payload.roomId !== roomId) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === payload.messageId
          ? { ...message, isDeleted: true }
          : message
      )
    );
  }, [roomId]);

  useRoomSocketEvent(socket, 'message:deleted', handleMessageDeleted);

  const sendMessage = useCallback(
    (content: string, parentMessageId?: string) => {
      if (!roomId || !isRealtimeReady || !canWriteChat) {
        return;
      }

      stopTyping?.();
      RoomAPI.createMessage(roomId, {
        content,
        ...(parentMessageId ? { parentMessageId } : {}),
      })
        .then((response) => {
          const createdMessage = response.data as Message;
          if (createdMessage.roomId !== roomId) return;

 
          setMessages((current) => {
            if (current.some((message) => message.id === createdMessage.id)) {
              return current;
            }
            return [...current, createdMessage];
          });
        })
        .catch((messageError: unknown) => {
          onError?.(toErrorMessage(messageError));
        });
    },
    [canWriteChat, isRealtimeReady, onError, roomId, stopTyping]
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (!roomId || !isRealtimeReady || !canWriteChat) return;

      RoomAPI.editMessage(roomId, messageId, { content })
        .then(() => {
          setMessages((current) =>
            current.map((message) =>
              message.id === messageId
                ? { ...message, content, isEdited: true }
                : message
            )
          );
        })
        .catch((messageError: unknown) => {
          onError?.(toErrorMessage(messageError));
        });
    },
    [canWriteChat, isRealtimeReady, onError, roomId]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!roomId || !isRealtimeReady || (!canDeleteOwnChat && !canModerateMessages)) return;

      RoomAPI.deleteMessage(roomId, messageId)
        .then(() => {
          setMessages((current) =>
            current.map((message) =>
              message.id === messageId
                ? { ...message, isDeleted: true }
                : message
            )
          );
        })
        .catch((messageError: unknown) => {
          onError?.(toErrorMessage(messageError));
        });
    },
    [canDeleteOwnChat, canModerateMessages, isRealtimeReady, onError, roomId]
  );

  return {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
  };
};
