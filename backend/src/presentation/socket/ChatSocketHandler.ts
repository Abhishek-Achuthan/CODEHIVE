import { inject, injectable } from 'tsyringe';
import type { Server as SocketIOServer, Socket } from 'socket.io';

import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';
import type { IRoomEventEmitter } from '../../application/ports/realtime/IRoomEventEmitter';
import { getUserId } from './socketHandlerUtils';
import { RoomAuthorizationService } from '../../application/services/RoomAuthorizationService';
import { CapabilityKey } from '../../domain/types/CapabilityKey';

interface TypingStartPayload {
  roomId: string;
  name: string;
}

interface TypingStopPayload {
  roomId: string;
}

@injectable()
export class ChatSocketHandler implements ISocketHandler {
  constructor(
    @inject('IRoomEventEmitter')
    private readonly roomEventEmitter: IRoomEventEmitter,

    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  register(_io: SocketIOServer, socket: Socket): void {
    socket.on('typing:start', async (payload: TypingStartPayload) => {
      const userId = getUserId(socket, true);
      if (userId) {
        const authorizationContext = await this.roomAuthorizationService.assertCapability(
          payload.roomId,
          userId,
          CapabilityKey.ROOM_CHAT_WRITE,
        );
        this.roomEventEmitter.emitTypingStarted(authorizationContext.room.id, socket.id, {
          userId,
          name: payload.name,
        });
      }
    });

    socket.on('typing:stop', async (payload: TypingStopPayload) => {
      const userId = getUserId(socket, true);
      if (userId) {
        const authorizationContext = await this.roomAuthorizationService.assertCapability(
          payload.roomId,
          userId,
          CapabilityKey.ROOM_CHAT_WRITE,
        );
        this.roomEventEmitter.emitTypingStopped(authorizationContext.room.id, socket.id, { userId });
      }
    });
  }
}
