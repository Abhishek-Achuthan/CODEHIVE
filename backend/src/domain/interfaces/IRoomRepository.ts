import { RoomEntity } from '../entities/room/RoomEntity';
import { PaginationResult } from '../types/PaginationResult';
import { IGenericRepository } from './IGenericRepository';

export interface IRoomRepository extends IGenericRepository<RoomEntity> {
  findAllPublic(page: number, limit: number, search?: string): Promise<PaginationResult<RoomEntity>>;
  findAllByHostId(
    hostId: string,
    page: number,
    limit: number,
    search?:string,
  ): Promise<PaginationResult<RoomEntity>>;
  countActiveRoomsByHostId(hostId: string): Promise<number>;
  incrementParticipantCount(
    roomId: string,
    maxParticipants: number,
  ): Promise<RoomEntity | null>;
  decrementParticipantCount(roomId: string): Promise<RoomEntity | null>;
}
