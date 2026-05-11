import { injectable } from 'tsyringe';
import type { Server as SocketIOServer, Socket } from 'socket.io';

import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';

import {
  emitSocketError,
  getUserId,
} from './socketHandlerUtils';

interface PollAwarenessPayload {
  roomId: string;
  pollId: string;
}

@injectable()
export class PollSocketHandler
  implements ISocketHandler
{
  register(
    _io: SocketIOServer,
    socket: Socket
  ): void {
    socket.on(
      'poll:viewing',
      (payload: PollAwarenessPayload) => {
        try {
          const userId = getUserId(
            socket,
            true
          );

          if (!userId) return;

          socket.to(payload.roomId).emit(
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