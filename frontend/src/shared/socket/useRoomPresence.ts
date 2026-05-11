import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoomSocketEvent } from './roomSocketEvents';
import type {
  Participant,
  RoomSnapshot,
  RoomSocket,
  RoomUserJoinedPayload,
  RoomUserLeftPayload,
} from './roomTypes';

type RoomParticipant = Omit<Participant, 'status'>;

interface UseRoomPresenceOptions {
  roomId: string | null;
  socket: RoomSocket | null;
  snapshot: RoomSnapshot | null;
}

interface UseRoomPresenceResult {
  participants: Participant[];
  onlineUserIds: Set<string>;
}

export const useRoomPresence = ({
  roomId,
  socket,
  snapshot,
}: UseRoomPresenceOptions): UseRoomPresenceResult => {
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (snapshot?.roomId !== roomId) {
      setParticipants([]);
      setOnlineUserIds(new Set());
      return;
    }

    setParticipants(
      snapshot.participants.map((participant) => ({
        id: participant.userId,
        name: participant.name,
        avatar: participant.avatarUrl,
        role: participant.role as any,
      }))
    );
    setOnlineUserIds(new Set(snapshot.onlineUserIds ?? []));
  }, [roomId, snapshot]);

  const handleUserJoined = useCallback(
    (payload: RoomUserJoinedPayload) => {
      if (payload.roomId && payload.roomId !== roomId) return;

      setParticipants((current) => {
        const existing = current.find(
          (participant) => participant.id === payload.userId
        );

        if (existing) {
          return current.map((participant) =>
            participant.id === payload.userId
              ? {
                  ...participant,
                  name: payload.name,
                  avatar: payload.avatarUrl,
                  role: payload.role,
                }
              : participant
          );
        }

        return [
          ...current,
          {
            id: payload.userId,
            name: payload.name,
            avatar: payload.avatarUrl,
            role: payload.role,
          },
        ];
      });

      setOnlineUserIds((current) => {
        const next = new Set(current);
        next.add(payload.userId);
        return next;
      });
    },
    [roomId]
  );

  useRoomSocketEvent(socket, 'room:user-joined', handleUserJoined);

  const handleUserLeft = useCallback(
    (payload: RoomUserLeftPayload) => {
      if (payload.roomId !== roomId) return;

      setOnlineUserIds((current) => {
        const next = new Set(current);
        next.delete(payload.userId);
        return next;
      });
    },
    [roomId]
  );

  useRoomSocketEvent(socket, 'room:user-left', handleUserLeft);

  const participantsWithPresence = useMemo<Participant[]>(
    () =>
      participants.map((participant) => ({
        ...participant,
        status: onlineUserIds.has(participant.id) ? 'online' : 'offline',
      })),
    [onlineUserIds, participants]
  );

  return {
    participants: participantsWithPresence,
    onlineUserIds,
  };
};
