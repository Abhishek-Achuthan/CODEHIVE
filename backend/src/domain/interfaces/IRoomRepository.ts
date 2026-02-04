import { RoomEntity } from '../entities/room/RoomEntity';

export interface IRoomRepository {
   create(room:RoomEntity):Promise<RoomEntity>;
   findById(id: string): Promise<RoomEntity | null>;
   findBySessionId(sessionId: string): Promise<RoomEntity | null>;
   update(data :RoomEntity): Promise<RoomEntity>;
}