import { inject, injectable } from 'tsyringe';
import type { Server as SocketIOServer, Socket } from 'socket.io';

import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';
import type { IRoomEventEmitter } from '../../application/ports/realtime/IRoomEventEmitter';
import { getUserId } from './socketHandlerUtils';

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
  ) {}

  register(_io: SocketIOServer, socket: Socket): void {
    socket.on('typing:start', (payload: TypingStartPayload) => {
      const userId = getUserId(socket, true);
      if (userId) {
        this.roomEventEmitter.emitTypingStarted(payload.roomId, socket.id, {
          userId,
          name: payload.name,
        });
      }
    });

    socket.on('typing:stop', (payload: TypingStopPayload) => {
      const userId = getUserId(socket, true);
      if (userId) {
        this.roomEventEmitter.emitTypingStopped(payload.roomId, socket.id, { userId });
      }
    });
  }
}
