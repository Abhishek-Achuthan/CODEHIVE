import type { SendMessageResponseDTO } from '../../dto/MessageDTO';
import type { ICreatePollOutputDTO } from '../../dto/PollDTO';

export interface MessageEditedPayload {
  messageId: string;
  content: string;
}

export interface MessageDeletedPayload {
  messageId: string;
}

export interface RoomUserPresencePayload {
  userId: string;
  name?: string;
  avatarUrl?: string;
}

export interface TypingStartedPayload {
  userId: string;
  name: string;
}

export interface TypingStoppedPayload {
  userId: string;
}

export interface IRoomEventEmitter {
  emitMessageCreated(roomId: string, payload: SendMessageResponseDTO): void;
  emitMessageEdited(roomId: string, payload: MessageEditedPayload): void;
  emitMessageDeleted(roomId: string, payload: MessageDeletedPayload): void;
  emitPollCreated(roomId: string, payload: ICreatePollOutputDTO): void;
  emitPollVoted(roomId: string, payload: ICreatePollOutputDTO): void;
  emitUserJoined(
    roomId: string,
    payload: RoomUserPresencePayload,
    excludedSocketId?: string,
  ): void;
  emitUserLeft(roomId: string, payload: Pick<RoomUserPresencePayload, 'userId'>): void;
  emitTypingStarted(
    roomId: string,
    excludedSocketId: string,
    payload: TypingStartedPayload,
  ): void;
  emitTypingStopped(
    roomId: string,
    excludedSocketId: string,
    payload: TypingStoppedPayload,
  ): void;
}
