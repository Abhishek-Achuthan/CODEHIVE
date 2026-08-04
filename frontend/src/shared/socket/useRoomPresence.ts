import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoomSocketEvent } from './roomSocketEvents';
import type {
  Participant,
  RoomSnapshot,
  RoomSocket,
  RoomUserJoinedPayload,
  RoomUserLeftPayload,
  RoomParticipantRemovedPayload,
} from './roomTypes';
import type { RoomRole } from '../types/api/room';

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

    const onlineIds = new Set(snapshot.onlineUserIds ?? []);

    setParticipants(
      snapshot.participants
        .filter((participant) => onlineIds.has(participant.userId))
        .map((participant) => ({
          id: participant.userId,
          name: participant.name,
          avatar: participant.avatarUrl,
          role: participant.role as RoomRole,
        }))
    );
    setOnlineUserIds(onlineIds);
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
                  role: payload.role ?? participant.role,
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
            role: payload.role as RoomRole,
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

      setParticipants((current) =>
        current.filter((p) => p.id !== payload.userId)
      );

      setOnlineUserIds((current) => {
        const next = new Set(current);
        next.delete(payload.userId);
        return next;
      });
    },
    [roomId]
  );

  useRoomSocketEvent(socket, 'room:user-left', handleUserLeft);

  const handleParticipantRemoved = useCallback(
    (payload: RoomParticipantRemovedPayload) => {
      if (payload.roomId !== roomId) return;

      setParticipants((current) =>
        current.filter((p) => p.id !== payload.userId)
      );

      setOnlineUserIds((current) => {
        const next = new Set(current);
        next.delete(payload.userId);
        return next;
      });
    },
    [roomId]
  );

  useRoomSocketEvent(socket, 'room:participant-removed', handleParticipantRemoved);

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
