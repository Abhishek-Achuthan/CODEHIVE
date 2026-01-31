import { Server as SocketIOServer, Socket } from 'socket.io';
import { injectable } from 'tsyringe';
import { ISocketService } from '../../../application/ports/socket/ISocketService';

@injectable()
export class SocketService implements ISocketService {
  private _io: SocketIOServer | null = null;

  private _userSockets: Map<string, Set<string>> = new Map();

  private _socketUsers: Map<string, string> = new Map();

  initialize(io: SocketIOServer): void {
    this._io = io;

    this._io.on('connection', (socket: Socket) => {
      socket.on('register', (userId: string) => {
        if (!this._userSockets.has(userId)) {
          this._userSockets.set(userId, new Set());
        }

        this._userSockets.get(userId)!.add(socket.id);
        this._socketUsers.set(socket.id, userId);
      });

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
      });

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
      });

      socket.on('disconnect', () => {
        const userId = this._socketUsers.get(socket.id);
        if (!userId) return;

        const sockets = this._userSockets.get(userId);
        sockets?.delete(socket.id);

        if (sockets && sockets.size === 0) {
          this._userSockets.delete(userId);
        }

        this._socketUsers.delete(socket.id);
      });
    });
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    const socketIds = this._userSockets.get(userId);
    if (!socketIds || !this._io) return;

    for (const socketId of socketIds) {
      this._io.to(socketId).emit(event, payload);
    }
  }

  joinRoom(userId: string, roomId: string): void {
    const socketIds = this._userSockets.get(userId);
    if (!socketIds || !this._io) return;

    for (const socketId of socketIds) {
      const socket = this._io.sockets.sockets.get(socketId);
      socket?.join(roomId);
    }
  }

  leaveRoom(userId: string, roomId: string): void {
    const socketIds = this._userSockets.get(userId);
    if (!socketIds || !this._io) return;

    for (const socketId of socketIds) {
      const socket = this._io.sockets.sockets.get(socketId);
      socket?.leave(roomId);
    }
  }

  emitToRoom(roomId: string, event: string, payload: unknown): void {
    this._io?.to(roomId).emit(event, payload);
  }

  broadcast(event: string, payload: unknown): void {
    this._io?.emit(event, payload);
  }

  isUserOnline(userId: string): boolean {
    return this._userSockets.has(userId);
  }
}
