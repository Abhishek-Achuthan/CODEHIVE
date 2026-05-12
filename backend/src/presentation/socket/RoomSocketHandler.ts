import { inject, injectable } from 'tsyringe';
import type { Server as SocketIOServer, Socket } from 'socket.io';

import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';
import type { IPresenceService } from '../../application/ports/presence/IPresenceService';
import type { IRoomEventEmitter } from '../../application/ports/realtime/IRoomEventEmitter';
import {
  emitSocketError,
  getJoinedRoomIds,
  getUserId,
} from './socketHandlerUtils';

interface SubscribeRoomPayload {
  roomId: string;
  user?: {
    name?: string;
    avatarUrl?: string;
  };
}

@injectable()
export class RoomSocketHandler implements ISocketHandler {
  constructor(
    @inject('IPresenceService')
    private readonly presenceService: IPresenceService,

    @inject('IRoomEventEmitter')
    private readonly roomEventEmitter: IRoomEventEmitter,
  ) {}

  register(_io: SocketIOServer, socket: Socket): void {
    socket.on('room:subscribe', (payload: SubscribeRoomPayload) => {
      try {
        const userId = getUserId(socket);
        if (!userId) return;

        const isFirstPresenceInRoom = this.subscribeSocketToRoom(
          socket,
          payload.roomId,
          userId,
        );

        socket.emit('room:subscribed', {
          roomId: payload.roomId,
          onlineUserIds: this.presenceService.getOnlineUserIds(payload.roomId),
        });

        if (isFirstPresenceInRoom) {
          this.roomEventEmitter.emitUserJoined(
            payload.roomId,
            {
              userId,
              name: payload.user?.name ?? 'Unknown User',
              ...(payload.user?.avatarUrl && {
                avatarUrl: payload.user.avatarUrl,
              }),
            },
            socket.id,
          );
        }
      } catch (error) {
        emitSocketError(socket, error);
      }
    });
  }

  private subscribeSocketToRoom(
    socket: Socket,
    roomId: string,
    userId: string,
  ): boolean {
    socket.join(roomId);
    getJoinedRoomIds(socket).add(roomId);

    return this.presenceService.joinRoom(roomId, userId, socket.id);
  }
}
