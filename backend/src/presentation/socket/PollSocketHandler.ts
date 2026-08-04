import { inject, injectable } from 'tsyringe';
import type { Server as SocketIOServer, Socket } from 'socket.io';

import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';

import {
  emitSocketError,
  getUserId,
} from './socketHandlerUtils';
import { RoomAuthorizationService } from '../../application/services/RoomAuthorizationService';
import { CapabilityKey } from '../../domain/types/CapabilityKey';

interface PollAwarenessPayload {
  roomId: string;
  pollId: string;
}

@injectable()
export class PollSocketHandler
  implements ISocketHandler
{
  constructor(
    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  register(
    _io: SocketIOServer,
    socket: Socket
  ): void {
    socket.on(
      'poll:viewing',
      async (payload: PollAwarenessPayload) => {
        try {
          const userId = getUserId(
            socket,
            true
          );

          if (!userId) return;

          const authorizationContext = await this.roomAuthorizationService.assertAnyCapability(
            payload.roomId,
            userId,
            [
              CapabilityKey.ROOM_POLLS_CREATE,
              CapabilityKey.ROOM_POLLS_VOTE,
              CapabilityKey.ROOM_POLLS_CLOSE,
            ],
            'read',
          );

          socket.to(authorizationContext.room.id).emit(
            'poll:viewing',
            {
              pollId: payload.pollId,
              userId,
            }
          );
        } catch (error) {
          emitSocketError(socket, error);
        }
      }
    );
  }
}
