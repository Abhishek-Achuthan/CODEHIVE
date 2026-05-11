import { useCallback, useState } from 'react';
import type { CreatePollRequest } from '../types/api/room';
import * as RoomAPI from '../../api/endpoints/roomAPI';
import { toErrorMessage } from './roomErrors';
import { useRoomSocketEvent } from './roomSocketEvents';
import type { Poll, RoomSocket } from './roomTypes';

interface UseRoomPollsOptions {
  roomId: string | null;
  socket: RoomSocket | null;
  isRealtimeReady: boolean;
  onError?: (message: string) => void;
}

interface UseRoomPollsResult {
  polls: Poll[];
  createPoll: (poll: CreatePollRequest) => void;
  votePoll: (pollId: string, optionIds: string[]) => void;
}

export const useRoomPolls = ({
  roomId,
  socket,
  isRealtimeReady,
  onError,
}: UseRoomPollsOptions): UseRoomPollsResult => {
  const [polls, setPolls] = useState<Poll[]>([]);

  const handlePollCreated = useCallback(
    (poll: Poll) => {
      if (poll.roomId !== roomId) return;

      setPolls((current) => {
        if (current.some((existing) => existing.id === poll.id)) return current;
        return [poll, ...current];
      });
    },
    [roomId]
  );

  useRoomSocketEvent(socket, 'poll:created', handlePollCreated);

  const handlePollVoted = useCallback(
    (poll: Poll) => {
      if (poll.roomId !== roomId) return;

      setPolls((current) =>
        current.map((existing) => (existing.id === poll.id ? poll : existing))
      );
    },
    [roomId]
  );

  useRoomSocketEvent(socket, 'poll:voted', handlePollVoted);

  const createPoll = useCallback(
    (poll: CreatePollRequest) => {
      if (!roomId || !isRealtimeReady) return;

      RoomAPI.createPoll(roomId, poll).catch((pollError: unknown) => {
        onError?.(toErrorMessage(pollError));
      });
    },
    [isRealtimeReady, onError, roomId]
  );

  const votePoll = useCallback(
    (pollId: string, optionIds: string[]) => {
      if (!roomId || !isRealtimeReady) return;

      RoomAPI.votePoll(roomId, pollId, optionIds).catch((pollError: unknown) => {
        onError?.(toErrorMessage(pollError));
      });
    },
    [isRealtimeReady, onError, roomId]
  );

  return {
    polls,
    createPoll,
    votePoll,
  };
};
