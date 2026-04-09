import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAppSelector } from '../hooks/storeHooks';

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export const useRoomSocket = (roomId: string | null) => {
  const { socket, isConnected, connectionError } = useSocket();
  const currentUser = useAppSelector((state) => state.auth.user);
  const joinedRoomRef = useRef<string | null>(null);
  const previousRoomIdRef = useRef<string | null>(null);
  const typingStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({}); // userId -> name
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previousRoomIdRef.current !== roomId) {
      previousRoomIdRef.current = roomId;
      joinedRoomRef.current = null;
      isTypingRef.current = false;
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }
      setIsJoined(false);
      setMessages([]);
      setParticipants([]);
      setTypingUsers({});
      setError(null);
    }
  }, [roomId]);

  useEffect(() => {
    if (!isConnected) {
      joinedRoomRef.current = null;
      isTypingRef.current = false;
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }
      setIsJoined(false);
      setTypingUsers({});
    }
  }, [isConnected]);

  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
      return;
    }

    if (!socket || !isConnected || !roomId) {
      return;
    }

    // room:joined → Snapshot delivery
    const handleJoined = (payload: { 
      roomId: string; 
      participants: Array<{ userId: string; name: string; avatarUrl?: string }>;
      messages: Message[];
    }) => {
      if (payload.roomId !== roomId) return;

      console.log('[useRoomSocket] Received snapshot for room:', payload.roomId);
      joinedRoomRef.current = payload.roomId;
      setIsJoined(true);

      setParticipants(
        payload.participants.map((p) => ({
          id: p.userId,
          name: p.name,
          avatar: p.avatarUrl,
          status: 'online', // At join, we assume they are online since they are in the list
        }))
      );

      setMessages(payload.messages);
    };

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleUserJoined = (payload: { userId: string; name: string; avatarUrl?: string; status?: string }) => {
      setParticipants((prev) => {
        const existing = prev.find((p) => p.id === payload.userId);
        if (existing) {
          return prev.map(p => p.id === payload.userId ? { ...p, status: 'online' as const } : p);
        }
        return [
          ...prev,
          {
            id: payload.userId,
            name: payload.name,
            avatar: payload.avatarUrl,
            status: 'online' as const,
          },
        ];
      });
    };

    const handleUserLeft = (payload: { userId: string }) => {
      setParticipants((prev) => prev.filter(p => p.id !== payload.userId));
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[payload.userId];
        return next;
      });
    };

    const handleStatusUpdate = (payload: { userId: string; status: 'online' | 'offline' }) => {
      setParticipants((prev) => prev.map(p => 
        p.id === payload.userId ? { ...p, status: payload.status } : p
      ));
    };

    const handleTypingStart = (payload: { userId: string; name: string }) => {
      setTypingUsers((prev) => ({ ...prev, [payload.userId]: payload.name }));
    };

    const handleTypingStop = (payload: { userId: string }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[payload.userId];
        return next;
      });
    };

    const handleError = (err: { message: string }) => {
      setError(err.message);
    };

    socket.on('room:joined', handleJoined);
    socket.on('message:new', handleMessage);
    socket.on('room:user-joined', handleUserJoined);
    socket.on('room:user-left', handleUserLeft);
    socket.on('room:user-status', handleStatusUpdate);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('error', handleError);

    if (!isJoined && !joinedRoomRef.current) {
      socket.emit('room:join', { roomId });
    }

    return () => {
      socket.off('room:joined', handleJoined);
      socket.off('message:new', handleMessage);
      socket.off('room:user-joined', handleUserJoined);
      socket.off('room:user-left', handleUserLeft);
      socket.off('room:user-status', handleStatusUpdate);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('error', handleError);
    };
  }, [socket, isConnected, roomId, connectionError, isJoined]);

  const emitTyping = useCallback((isTyping: boolean) => {
    if (!socket || !roomId || !isJoined) return;

    if (!isTyping) {
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }

      if (!isTypingRef.current) return;

      isTypingRef.current = false;
      socket.emit('typing:stop', { roomId });
      return;
    }

    if (!isTypingRef.current) {
      const name = currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : 'Someone';
      socket.emit('typing:start', { roomId, name });
      isTypingRef.current = true;
    }

    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
    }

    typingStopTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('typing:stop', { roomId });
      typingStopTimeoutRef.current = null;
    }, 500);
  }, [socket, roomId, isJoined, currentUser]);

  const sendMessage = useCallback((content: string) => {
    if (!socket || !roomId || !isJoined) return;
    emitTyping(false);
    socket.emit('message:send', { roomId, content });
  }, [socket, roomId, isJoined, emitTyping]);

  const leaveRoom = useCallback(() => {
    if (!socket || !roomId || joinedRoomRef.current !== roomId) return;
    emitTyping(false);
    socket.emit('room:leave', { roomId });
    setIsJoined(false);
    setMessages([]);
    setParticipants([]);
    setTypingUsers({});
    joinedRoomRef.current = null;
  }, [socket, roomId, emitTyping]);

  useEffect(() => {
    return () => {
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    participants,
    typingUsers: Object.values(typingUsers),
    sendMessage,
    emitTyping,
    leaveRoom,
    isJoined,
    error,
    isConnected,
  };
};
