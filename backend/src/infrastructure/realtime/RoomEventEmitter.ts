import { inject, injectable } from 'tsyringe';

import type {
  IRoomEventEmitter,
  MessageDeletedPayload,
  MessageEditedPayload,
  ParticipantPermissionsUpdatedPayload,
  RoomUserPresencePayload,
  TypingStartedPayload,
  TypingStoppedPayload,
} from '../../application/ports/realtime/IRoomEventEmitter';
import { RoomLifeCycleStatus } from '../../domain/types/RoomLifeCycleStatus';
import type { ISocketService } from '../../application/ports/socket/ISocketService';
import type { SendMessageResponseDTO } from '../../application/dto/MessageDTO';
import type {
  IClosePollOutputDTO,
  ICreatePollOutputDTO,
} from '../../application/dto/PollDTO';

@injectable()
export class RoomEventEmitter implements IRoomEventEmitter {
  constructor(
    @inject('ISocketService')
    private readonly _socketService: ISocketService,
  ) {}

  emitMessageCreated(roomId: string, payload: SendMessageResponseDTO): void {
    this._socketService.emitToRoom(roomId, 'message:created', payload);
  }

  emitMessageEdited(roomId: string, payload: MessageEditedPayload): void {
    this._socketService.emitToRoom(roomId, 'message:edited', payload);
  }

  emitMessageDeleted(roomId: string, payload: MessageDeletedPayload): void {
    this._socketService.emitToRoom(roomId, 'message:deleted', payload);
  }

  emitPollCreated(roomId: string, payload: ICreatePollOutputDTO): void {
    this._socketService.emitToRoom(roomId, 'poll:created', payload);
  }

  emitPollVoted(roomId: string, payload: ICreatePollOutputDTO): void {
    this._socketService.emitToRoom(roomId, 'poll:voted', payload);
  }

  emitPollEnded(roomId: string, payload: IClosePollOutputDTO): void {
    this._socketService.emitToRoom(roomId, 'poll:ended', payload);
  }

  emitUserJoined(
    roomId: string,
    payload: RoomUserPresencePayload,
    excludedSocketId?: string,
  ): void {
    if (excludedSocketId) {
      this._socketService.emitToRoomExcept(
        roomId,
        excludedSocketId,
        'room:user-joined',
        payload,
      );
      return;
    }

    this._socketService.emitToRoom(roomId, 'room:user-joined', payload);
  }

  emitUserLeft(
    roomId: string,
    payload: Pick<RoomUserPresencePayload, 'userId'>,
  ): void {
    this._socketService.emitToRoom(roomId, 'room:user-left', {
      roomId,
      ...payload,
    });
  }

  emitParticipantRemoved(
    roomId: string,
    payload: { userId: string },
  ): void {
    this._socketService.emitToRoom(roomId, 'room:participant-removed', {
      roomId,
      ...payload,
    });
  }

  emitTypingStarted(
    roomId: string,
    excludedSocketId: string,
    payload: TypingStartedPayload,
  ): void {
    this._socketService.emitToRoomExcept(
      roomId,
      excludedSocketId,
      'typing:start',
      payload,
    );
  }

  emitTypingStopped(
    roomId: string,
    excludedSocketId: string,
    payload: TypingStoppedPayload,
  ): void {
    this._socketService.emitToRoomExcept(
      roomId,
      excludedSocketId,
      'typing:stop',
      payload,
    );
  }

  emitLifecycleChanged(roomId: string, lifecycleStatus: RoomLifeCycleStatus): void {
    this._socketService.emitToRoom(roomId, 'room:lifecycle-changed', {
      roomId,
      lifecycleStatus,
    });
  }

  emitPermissionsUpdated(
    roomId: string,
    payload: ParticipantPermissionsUpdatedPayload,
  ): void {
    this._socketService.emitToRoom(roomId, 'participant:permissions-updated', payload);
  }
}
