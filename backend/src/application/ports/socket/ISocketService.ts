import { Server as SocketIOServer } from 'socket.io';

export interface ISocketService {
  initialize(io: SocketIOServer): void;
  emitToUser(userId: string, event: string, payload: unknown): void;
  emitToRoom(roomId: string, event: string, payload: unknown): void;
  broadcast(event: string, payload: unknown): void;
  isUserOnline(userId: string): boolean;
}
