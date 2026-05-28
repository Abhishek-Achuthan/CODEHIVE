import { RoomBanEntity } from '../entities/room/RoomBanEntity';

export interface IRoomBanRepository {
  create(data: Omit<RoomBanEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoomBanEntity>;

  exists(roomId: string, userId: string): Promise<boolean>;

  findByRoomAndUser(roomId: string, userId: string): Promise<RoomBanEntity | null>;
}
