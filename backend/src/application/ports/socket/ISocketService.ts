import { Server as SocketIOServer } from 'socket.io';

export interface ISocketService {
  initialize(io: SocketIOServer): void;
  emitToUser(userId: string, event: string, payload: unknown): void;
  joinRoom(userId: string, roomId: string): void;
  leaveRoom(userId: string, roomId: string): void;
  emitToRoom(roomId: string, event: string, payload: unknown): void;
  broadcast(event: string, payload: unknown): void;
  isUserOnline(userId: string): boolean;
}