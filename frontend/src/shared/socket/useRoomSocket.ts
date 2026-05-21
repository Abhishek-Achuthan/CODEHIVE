import { useCallback, useEffect, useMemo, useState } from "react";
import { useSocket } from "./useSocket";
import { useRoomConnection } from "./useRoomConnection";
import { useRoomMessages } from "./useRoomMessages";
import { useRoomPolls } from "./useRoomPolls";
import { useRoomPresence } from "./useRoomPresence";
import { useRoomTyping } from "./useRoomTyping";
import type { Message, Participant, Poll, RoomSocket } from "./roomTypes";
import { buildRoomAuthorization } from "../../features/room/authorization/roomAuthorization";

export type { Message, Participant, Poll };

export const useRoomSocket = (roomId: string | null) => {
  const { socket, isConnected } = useSocket();
  const roomSocket = socket as RoomSocket | null;
  const [featureError, setFeatureError] = useState<string | null>(null);

  const {
    connectionState,
    snapshot,
    error: connectionError,
    leaveRoom,
  } = useRoomConnection(roomId);
  const authorization = useMemo(() => buildRoomAuthorization(snapshot), [snapshot]);

  const isRealtimeReady = connectionState === "ready";
  const hasRoomSnapshot = snapshot !== null;

  useEffect(() => {
    setFeatureError(null);
  }, [roomId]);

  const handleFeatureError = useCallback((message: string) => {
    setFeatureError(message);
  }, []);

  const { participants } = useRoomPresence({
    roomId,
    socket: roomSocket,
    snapshot,
  });

  const { typingUsers, emitTyping } = useRoomTyping({
    roomId,
    socket: roomSocket,
    isRealtimeReady,
    canWriteChat: authorization.canWriteChat,
  });

  const stopTyping = useCallback(() => {
    emitTyping(false);
  }, [emitTyping]);

  const { messages, sendMessage, editMessage, deleteMessage } = useRoomMessages(
    {
      roomId,
      socket: roomSocket,
      snapshot,
      isRealtimeReady,
      canWriteChat: authorization.canWriteChat,
      canDeleteOwnChat: authorization.canDeleteOwnChat,
      canModerateMessages: authorization.canModerateParticipants,
      onError: handleFeatureError,
      stopTyping,
    },
  );

  const initialPolls = useMemo(() => 
    (snapshot?.activePoll ? [snapshot.activePoll] : []) as Poll[], 
    [snapshot?.activePoll]
  );

  const { polls, createPoll, votePoll, closePoll } = useRoomPolls({
    roomId,
    socket: roomSocket,
    isRealtimeReady,
    initialPolls,
    canCreatePolls: authorization.canCreatePolls,
    canVotePolls: authorization.canVotePolls,
    canClosePolls: authorization.canClosePolls,
    onError: handleFeatureError,
  });

  return {
    connectionState,
    snapshot,
    authorization,
    messages,
    participants,
    polls,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    createPoll,
    votePoll,
    closePoll,
    emitTyping,
    leaveRoom,
    hasRoomSnapshot,
    isRealtimeReady,
    error: connectionError ?? featureError,
    isConnected,
  };
};
