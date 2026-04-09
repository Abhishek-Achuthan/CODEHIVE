import { inject, injectable } from 'tsyringe';
import { Server as SocketIOServer, Socket } from 'socket.io';

import type { ISocketHandler } from '../../application/ports/socket/ISocketHandler';
import type { IJoinRoomUseCase } from '../../application/useCase/interface/room/IJoinRoomUseCase';
import type { ISendMessageUseCase } from '../../application/useCase/interface/message/ISendMessageUseCase';
import type { ILeaveRoomUseCase } from '../../application/useCase/interface/room/ILeaveRoomUseCase';
import type { ISocketService } from '../../application/ports/socket/ISocketService';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

interface JoinRoomPayload {
  roomId: string;
}

interface SendMessagePayload {
  roomId: string;
  content: string;
}

@injectable()
export class RoomSocketHandler implements ISocketHandler {
  constructor(
    @inject('IJoinRoomUseCase')
    private readonly joinRoomUseCase: IJoinRoomUseCase,

    @inject('ISendMessageUseCase')
    private readonly sendMessageUseCase: ISendMessageUseCase,

    @inject('ILeaveRoomUseCase')
    private readonly leaveRoomUseCase: ILeaveRoomUseCase,

    @inject('ISocketService')
    private readonly socketService: ISocketService,
  ) {}

  register(io: SocketIOServer, socket: Socket): void {
    socket.on('room:join', async (payload: JoinRoomPayload) => {
      try {
        const userId = this.getUserId(socket);
        if (!userId) return;

        const snapshot = await this.joinRoomUseCase.execute({
          roomId: payload.roomId,
          userId,
        });

        socket.join(snapshot.roomId);
        this.getJoinedRoomIds(socket).add(snapshot.roomId);

        // Send full snapshot to joining user
        socket.emit('room:joined', {
          roomId: snapshot.roomId,
          participants: snapshot.participants,
          messages: snapshot.messages,
        });

        // Find details for broadcast
        const joiningUser = snapshot.participants.find((p) => p.userId === userId);

        if (snapshot.isNewParticipant) {
          socket.to(snapshot.roomId).emit('room:user-joined', {
            userId,
            name: joiningUser?.name ?? 'Unknown User',
            avatarUrl: joiningUser?.avatarUrl,
            status: 'online',
          });
        }

        // Broadcast presence status
        io.to(snapshot.roomId).emit('room:user-status', {
           userId,
           status: 'online'
        });

      } catch (error) {
        this.emitError(socket, error);
      }
    });

    socket.on('message:send', async (payload: SendMessagePayload) => {
      try {
        const userId = this.getUserId(socket);
        if (!userId) return;

        const message = await this.sendMessageUseCase.execute({
          roomId: payload.roomId,
          senderId: userId,
          content: payload.content,
        });

        io.to(message.roomId).emit('message:new', message);
      } catch (error) {
        this.emitError(socket, error);
      }
    });

    socket.on('typing:start', (payload: { roomId: string; name: string }) => {
      const userId = this.getUserId(socket, true);
      if (userId) {
        socket.to(payload.roomId).emit('typing:start', { userId, name: payload.name });
      }
    });

    socket.on('typing:stop', (payload: { roomId: string }) => {
      const userId = this.getUserId(socket, true);
      if (userId) {
        socket.to(payload.roomId).emit('typing:stop', { userId });
      }
    });

    socket.on('room:leave', async (payload: { roomId: string }) => {
        try {
            const userId = this.getUserId(socket);
            if (!userId) return;

            await this.leaveRoomUseCase.execute({ roomId: payload.roomId, userId });
            
            socket.leave(payload.roomId);
            this.getJoinedRoomIds(socket).delete(payload.roomId);
            socket.to(payload.roomId).emit('room:user-left', { userId });
            
            // Presence
            io.to(payload.roomId).emit('room:user-status', {
                userId,
                status: 'offline'
            });
        } catch (error) {
            this.emitError(socket, error);
        }
    });

    socket.on('disconnect', async () => {
        const userId = socket.data.userId;
        if (userId && typeof userId === 'string') {
            if (this.socketService.isUserOnline(userId)) {
              return;
            }

            this.getJoinedRoomIds(socket).forEach((roomId) => {
              io.to(roomId).emit('room:user-status', {
                userId,
                status: 'offline'
              });
            });
        }
    });
  }

  private getJoinedRoomIds(socket: Socket): Set<string> {
    const existing = socket.data.joinedRoomIds;
    if (existing instanceof Set) {
      return existing as Set<string>;
    }

    const joinedRoomIds = new Set<string>();
    socket.data.joinedRoomIds = joinedRoomIds;
    return joinedRoomIds;
  }


  private getUserId(socket: Socket, quiet = false): string | null {
    const userId = socket.data.userId;

    if (!userId || typeof userId !== 'string') {
      if (quiet) return null;
      throw new Error(ERROR_MESSAGES.ROOM.UNAUTHORIZED);
    }

    return userId;
  }

  private emitError(socket: Socket, error: unknown): void {
    const message =
      error instanceof Error ? error.message : ERROR_MESSAGES.SERVER.UNEXPECTED_ERROR;
    socket.emit('error', { message });
  }
}
