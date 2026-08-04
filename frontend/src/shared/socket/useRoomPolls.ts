import { useCallback, useEffect, useState } from 'react';
import type { CreatePollRequest } from '../types/api/room';
import * as RoomAPI from '../../api/endpoints/roomAPI';
import { toErrorMessage } from './roomErrors';
import { useRoomSocketEvent } from './roomSocketEvents';
import type { Poll, RoomSocket } from './roomTypes';

interface UseRoomPollsOptions {
  roomId: string | null;
  socket: RoomSocket | null;
  isRealtimeReady: boolean;
  initialPolls?: Poll[];
  canCreatePolls: boolean;
  canVotePolls: boolean;
  canClosePolls: boolean;
  onError?: (message: string) => void;
}

interface UseRoomPollsResult {
  polls: Poll[];
  createPoll: (poll: CreatePollRequest) => void;
  votePoll: (pollId: string, optionIds: string[]) => void;
  closePoll: (pollId:string) => void;
}

export const useRoomPolls = ({
  roomId,
  socket,
  isRealtimeReady,
  initialPolls,
  canCreatePolls,
  canVotePolls,
  canClosePolls,
  onError,
}: UseRoomPollsOptions): UseRoomPollsResult => {
  const [polls, setPolls] = useState<Poll[]>(initialPolls ?? []);

  useEffect(() => {
    if (initialPolls) {
      setPolls(initialPolls);
    }
  }, [initialPolls]);

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

  const handlePollClosed = useCallback((poll:Poll)=>{
    if(poll.roomId !== roomId) return;

    setPolls((current)=>current.map((existing)=> existing.id === poll.id? poll: existing));
  },[roomId])

  useRoomSocketEvent(socket, 'poll:ended', handlePollClosed);

  const createPoll = useCallback(
    (poll: CreatePollRequest) => {
      if (!roomId || !isRealtimeReady || !canCreatePolls) return;

      RoomAPI.createPoll(roomId, poll).catch((pollError: unknown) => {
        onError?.(toErrorMessage(pollError));
      });
    },
    [canCreatePolls, isRealtimeReady, onError, roomId]
  );

  const votePoll = useCallback(
    (pollId: string, optionIds: string[]) => {
      if (!roomId || !isRealtimeReady || !canVotePolls) return;

      RoomAPI.votePoll(roomId, pollId, optionIds).catch((pollError: unknown) => {
        onError?.(toErrorMessage(pollError));
      });
    },
    [canVotePolls, isRealtimeReady, onError, roomId]
  );

  const closePoll = useCallback(
    (pollId:string)=>{
      if (!roomId || !isRealtimeReady || !canClosePolls) return;

      RoomAPI.closePoll(roomId, pollId).catch((pollError: unknown) => {
        onError?.(toErrorMessage(pollError));
      });
    },
    [canClosePolls, isRealtimeReady, onError, roomId]
    );

  return {
    polls,
    createPoll,
    votePoll,
    closePoll,
  };
};
