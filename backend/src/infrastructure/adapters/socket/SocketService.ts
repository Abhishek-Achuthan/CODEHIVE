import { Server as SocketIOServer, Socket } from 'socket.io';
import { inject, injectable } from 'tsyringe';
import { JwtPayload } from 'jsonwebtoken';
import { ISocketService } from '../../../application/ports/socket/ISocketService';
import type { IJWTService } from '../../../application/ports/security/IJWTService';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';

@injectable()
export class SocketService implements ISocketService {
  constructor(
    @inject('IJWTService') private readonly _jwtService: IJWTService,
    @inject('IUserRepository') private readonly _userRepository: IUserRepository,
  ) {}

  private _io: SocketIOServer | null = null;

  private _userSockets: Map<string, Set<string>> = new Map();

  private _socketUsers: Map<string, string> = new Map();

  initialize(io: SocketIOServer): void {
    this._io = io;

    this._io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token;

        if (!token || typeof token !== 'string') {
          return next(new Error('Unauthorized'));
        }

        const decoded = this._jwtService.verifyAccessToken(token) as JwtPayload;

        if (!decoded?.sub) {
          return next(new Error('Unauthorized'));
        }

        const user = await this._userRepository.find(decoded.sub);

        if (!user || user.isBlocked) {
          return next(new Error('Unauthorized'));
        }

        socket.data.userId = user.id;
        next();
      } catch {
        return next(new Error('Unauthorized'));
      }
    });

    this._io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId as string | undefined;

      if (!userId) {
        socket.disconnect();
        return;
      }

      if (!this._userSockets.has(userId)) {
        this._userSockets.set(userId, new Set());
      }

      this._userSockets.get(userId)!.add(socket.id);
      this._socketUsers.set(socket.id, userId);
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
