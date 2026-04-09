import { MessageEntity } from "../entities/room/MessageEntity";
import { IGenericRepository } from "./IGenericRepository";

export interface IMessageRepository extends IGenericRepository<MessageEntity> {
  findByRoomId(roomId: string): Promise<MessageEntity[]>;
  findRecentByRoomId(roomId: string, limit: number): Promise<MessageEntity[]>;
}
