import { PrivateNoteEntity } from '../../../../../domain/entities/room/PrivateNoteEntity';

export interface SavePrivateNoteDTO {
  userId: string;
  roomId: string;
  content: Record<string, unknown>;
}

export interface ISavePrivateNoteUseCase {
  execute(data: SavePrivateNoteDTO): Promise<PrivateNoteEntity>;
}
