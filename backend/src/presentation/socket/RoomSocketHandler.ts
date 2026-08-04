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
import { RoomAuthorizationService } from '../../application/services/RoomAuthorizationService';

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

    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  register(_io: SocketIOServer, socket: Socket): void {
    socket.on('room:subscribe', async (payload: SubscribeRoomPayload) => {
      try {
        const userId = getUserId(socket);
        if (!userId) return;

        const authorizationContext = await this.roomAuthorizationService.assertParticipant(
          payload.roomId,
          userId,
          'read',
        );

        const isFirstPresenceInRoom = this.subscribeSocketToRoom(
          socket,
          authorizationContext.room.id,
          userId,
        );

        socket.emit('room:subscribed', {
          roomId: authorizationContext.room.id,
          onlineUserIds: this.presenceService.getOnlineUserIds(authorizationContext.room.id),
          capabilities: authorizationContext.capabilities,
          lifecycleStatus: authorizationContext.room.lifecycleStatus,
          featureSnapshot: authorizationContext.room.featureSnapshot,
        });

        if (isFirstPresenceInRoom) {
          this.roomEventEmitter.emitUserJoined(
            authorizationContext.room.id,
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
