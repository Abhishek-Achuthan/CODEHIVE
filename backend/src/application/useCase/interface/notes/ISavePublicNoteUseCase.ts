import { PublicNoteEntity } from '../../../../domain/entities/room/PublicNoteEntity';

export interface SavePublicNoteDTO {
  roomId: string;
  userId: string;
  content: string;
}

export interface ISavePublicNoteUseCase {
  execute(data: SavePublicNoteDTO): Promise<PublicNoteEntity>;
}
