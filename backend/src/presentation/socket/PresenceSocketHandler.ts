import { inject, injectable } from 'tsyringe';
import type { Server as SocketIOServer, Socket } from 'socket.io';

import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';
import type { IPresenceService } from '../../application/ports/presence/IPresenceService';
import type { IRoomEventEmitter } from '../../application/ports/realtime/IRoomEventEmitter';
import { emitSocketError, getJoinedRoomIds, getUserId } from './socketHandlerUtils';

interface LeaveRoomPayload {
  roomId: string;
}

@injectable()
export class PresenceSocketHandler implements ISocketHandler {
  constructor(
    @inject('IPresenceService')
    private readonly presenceService: IPresenceService,

    @inject('IRoomEventEmitter')
    private readonly roomEventEmitter: IRoomEventEmitter,
  ) {}

  register(io: SocketIOServer, socket: Socket): void {
    socket.on('room:leave', (payload: LeaveRoomPayload) => {
      try {
        const userId = getUserId(socket);
        if (!userId) return;

        socket.leave(payload.roomId);
        getJoinedRoomIds(socket).delete(payload.roomId);

        const isLastPresenceInRoom = this.presenceService.leaveRoom(
          payload.roomId,
          userId,
          socket.id,
        );

        if (isLastPresenceInRoom) {
          this.roomEventEmitter.emitUserLeft(payload.roomId, { userId });
        }
      } catch (error) {
        emitSocketError(socket, error);
      }
    });

    socket.on('disconnect', () => {
      const changes = this.presenceService.removeSocket(socket.id);

      for (const change of changes) {
        socket.leave(change.roomId);
        getJoinedRoomIds(socket).delete(change.roomId);

        if (change.isLastConnectionInRoom) {
          this.roomEventEmitter.emitUserLeft(change.roomId, {
            userId: change.userId,
          });
        }
      }
    });
  }
}

