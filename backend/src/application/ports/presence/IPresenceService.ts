export interface RoomPresenceChange {
  roomId: string;
  userId: string;
  isLastConnectionInRoom: boolean;
}

export interface IPresenceService {
  joinRoom(roomId: string, userId: string, socketId: string): boolean;
  leaveRoom(roomId: string, userId: string, socketId: string): boolean;
  removeSocket(socketId: string): RoomPresenceChange[];
  getOnlineUserIds(roomId: string): string[];
  isUserOnlineInRoom(roomId: string, userId: string): boolean;
}
