import { Server as SocketIOServer, Socket } from 'socket.io';

export interface ISocketHandler {
  register(io: SocketIOServer, socket: Socket): void;
}
