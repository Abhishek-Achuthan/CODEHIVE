import { RoomInviteEntity } from '../entities/room/RoomInviteEntity';
import { RoomInviteType } from '../types/RoomInviteType';

export interface IRoomInviteRepository {
  create(data: Omit<RoomInviteEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoomInviteEntity>;

  findByCodeHash(codeHash: string): Promise<RoomInviteEntity | null>;

  findActiveByRoomId(roomId: string, type?: RoomInviteType): Promise<RoomInviteEntity | null>;

  findActiveBySessionId(sessionId: string): Promise<RoomInviteEntity | null>;

  listByRoomId(roomId: string): Promise<RoomInviteEntity[]>;

  revokeById(inviteId: string): Promise<RoomInviteEntity | null>;

  revokeAllActiveForRoom(roomId: string, type?: RoomInviteType): Promise<void>;

  incrementUseCount(inviteId: string): Promise<void>;
}
