import { PrivateNoteEntity } from '../entities/room/PrivateNoteEntity';

export interface IPrivateNoteRepository {
  findByRoomAndUser(
    roomId: string,
    userId: string
  ): Promise<PrivateNoteEntity | null>;

  upsert(note: PrivateNoteEntity): Promise<PrivateNoteEntity>;
}
