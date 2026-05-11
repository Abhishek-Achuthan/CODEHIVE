import { injectable } from "tsyringe";

import {
  IPresenceService,
  RoomPresenceChange,
} from "../../../application/ports/presence/IPresenceService";

@injectable()
export class PresenceService implements IPresenceService {
  private readonly roomUsers = new Map<string, Map<string, Set<string>>>();

  private readonly socketRooms = new Map<string, Set<string>>();

  private readonly socketUsers = new Map<string, string>();

  joinRoom(roomId: string, userId: string, socketId: string): boolean {
    const users = this.getOrCreateRoomUsers(roomId);
    const existingUserSockets = users.get(userId);
    const isFirstConnectionInRoom =
      !existingUserSockets || existingUserSockets.size === 0;

    const userSockets = existingUserSockets ?? new Set<string>();
    userSockets.add(socketId);
    users.set(userId, userSockets);

    const rooms = this.socketRooms.get(socketId) ?? new Set<string>();
    rooms.add(roomId);
    this.socketRooms.set(socketId, rooms);
    this.socketUsers.set(socketId, userId);

    return isFirstConnectionInRoom;
  }

  leaveRoom(roomId: string, userId: string, socketId: string): boolean {
    const users = this.roomUsers.get(roomId);
    const sockets = users?.get(userId);

    if (!users || !sockets) {
      this.removeRoomFromSocket(socketId, roomId);
      return false;
    }

    sockets.delete(socketId);
    this.removeRoomFromSocket(socketId, roomId);

    if (sockets.size > 0) {
      return false;
    }

    users.delete(userId);
    if (users.size === 0) {
      this.roomUsers.delete(roomId);
    }

    return true;
  }

  removeSocket(socketId: string): RoomPresenceChange[] {
    const userId = this.socketUsers.get(socketId);
    const rooms = this.socketRooms.get(socketId);

    if (!userId || !rooms) {
      return [];
    }

    const changes: RoomPresenceChange[] = [];
    for (const roomId of Array.from(rooms)) {
      const isLastConnectionInRoom = this.leaveRoom(roomId, userId, socketId);
      changes.push({ roomId, userId, isLastConnectionInRoom });
    }

    this.socketRooms.delete(socketId);
    this.socketUsers.delete(socketId);

    return changes;
  }

  getOnlineUserIds(roomId: string): string[] {
    return Array.from(this.roomUsers.get(roomId)?.keys() ?? []);
  }

  isUserOnlineInRoom(roomId: string, userId: string): boolean {
    const sockets = this.roomUsers.get(roomId)?.get(userId);
    return !!sockets && sockets.size > 0;
  }

  private getOrCreateRoomUsers(roomId: string): Map<string, Set<string>> {
    const existing = this.roomUsers.get(roomId);
    if (existing) {
      return existing;
    }

    const users = new Map<string, Set<string>>();
    this.roomUsers.set(roomId, users);
    return users;
  }

  private removeRoomFromSocket(socketId: string, roomId: string): void {
    const rooms = this.socketRooms.get(socketId);
    if (!rooms) {
      return;
    }

    rooms.delete(roomId);
    if (rooms.size === 0) {
      this.socketRooms.delete(socketId);
      this.socketUsers.delete(socketId);
    }
  }
}
