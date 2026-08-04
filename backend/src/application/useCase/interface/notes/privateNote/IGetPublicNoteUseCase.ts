import { PublicNoteEntity } from '../../../../../domain/entities/room/PublicNoteEntity';

export interface GetPublicNoteDTO {
  roomId: string;
  userId: string;
}

export interface IGetPublicNoteUseCase {
  execute(data: GetPublicNoteDTO): Promise<PublicNoteEntity | null>;
}
