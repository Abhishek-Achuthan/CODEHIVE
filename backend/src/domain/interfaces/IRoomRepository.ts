import { RoomEntity } from '../entities/room/RoomEntity';
import { PaginationResult } from '../types/PaginationResult';
import { IGenericRepository } from './IGenericRepository';

export interface IRoomRepository
  extends IGenericRepository<RoomEntity>
{
    findAllPublic(page:number,limit:number ): Promise<PaginationResult<RoomEntity>>;
    countActiveRoomsByHostId(hostId: string): Promise<number>;
}
