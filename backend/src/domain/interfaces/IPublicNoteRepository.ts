import { PublicNoteDoc } from "../../infrastructure/database/schemas/room/PublicNoteSchema";
import { PublicNoteEntity } from "../entities/room/PublicNoteEntity";
import { IGenericRepository } from "./IGenericRepository";


export interface IPublicNoteRepository extends IGenericRepository<PublicNoteEntity> {
  findByRoomId(roomId: string): Promise<PublicNoteEntity | null>
  upsert(roomId: string, content: string, updatedBy: string): Promise<PublicNoteEntity>;
}
