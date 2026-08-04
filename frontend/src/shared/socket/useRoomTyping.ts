import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/storeHooks';
import { useRoomSocketEvent } from './roomSocketEvents';
import type {
  RoomSocket,
  RoomUserLeftPayload,
  TypingStartPayload,
  TypingStopPayload,
} from './roomTypes';

const TYPING_STOP_DELAY_MS = 500;

interface UseRoomTypingOptions {
  roomId: string | null;
  socket: RoomSocket | null;
  isRealtimeReady: boolean;
  canWriteChat: boolean;
}

interface UseRoomTypingResult {
  typingUsers: string[];
  emitTyping: (isTyping: boolean) => void;
}

export const useRoomTyping = ({
  roomId,
  socket,
  isRealtimeReady,
  canWriteChat,
}: UseRoomTypingOptions): UseRoomTypingResult => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id ?? null;
  const currentUserName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'Someone';
  const [typingUsersById, setTypingUsersById] = useState<Record<string, string>>({});
  const [localTyping, setLocalTyping] = useState(false);
  const [typingDeadline, setTypingDeadline] = useState<number | null>(null);

  const stopTyping = useCallback(() => {
    if (!socket || !roomId || !localTyping) {
      setTypingDeadline(null);
      setLocalTyping(false);
      return;
    }

    socket.emit('typing:stop', { roomId });
    setTypingDeadline(null);
    setLocalTyping(false);
  }, [localTyping, roomId, socket]);

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !roomId || !isRealtimeReady || !canWriteChat) return;

      if (!isTyping) {
        stopTyping();
        return;
      }

      if (!localTyping) {
        socket.emit('typing:start', { roomId, name: currentUserName });
        setLocalTyping(true);
      }

      setTypingDeadline(Date.now() + TYPING_STOP_DELAY_MS);
    },
    [
      currentUserName,
      canWriteChat,
      isRealtimeReady,
      localTyping,
      roomId,
      socket,
      stopTyping,
    ]
  );

  useEffect(() => {
    if (!typingDeadline) return;

    const timeoutMs = Math.max(0, typingDeadline - Date.now());
    const timeoutId = window.setTimeout(stopTyping, timeoutMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [stopTyping, typingDeadline]);

  useEffect(() => {
    if (isRealtimeReady && canWriteChat) return;

    setTypingUsersById({});
    setTypingDeadline(null);
    setLocalTyping(false);
  }, [canWriteChat, isRealtimeReady, roomId]);

  const handleTypingStart = useCallback(
    (payload: TypingStartPayload) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      if (payload.userId === currentUserId) return;

      setTypingUsersById((current) => ({
        ...current,
        [payload.userId]: payload.name,
      }));
    },
    [currentUserId, roomId]
  );

  useRoomSocketEvent(socket, 'typing:start', handleTypingStart);

  const handleTypingStop = useCallback((payload: TypingStopPayload) => {
    setTypingUsersById((current) => {
      const next = { ...current };
      delete next[payload.userId];
      return next;
    });
  }, []);

  useRoomSocketEvent(socket, 'typing:stop', handleTypingStop);

  const handleUserLeft = useCallback((payload: RoomUserLeftPayload) => {
    setTypingUsersById((current) => {
      const next = { ...current };
      delete next[payload.userId];
      return next;
    });
  }, []);

  useRoomSocketEvent(socket, 'room:user-left', handleUserLeft);

  return {
    typingUsers: Object.values(typingUsersById),
    emitTyping,
  };
};
