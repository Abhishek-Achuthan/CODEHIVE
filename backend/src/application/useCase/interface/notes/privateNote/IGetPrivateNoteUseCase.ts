import { PrivateNoteEntity } from '../../../../../domain/entities/room/PrivateNoteEntity';

export interface GetPrivateNoteDTO {
  roomId: string;
  userId: string;
}

export interface IGetPrivateNoteUseCase {
  execute(data: GetPrivateNoteDTO): Promise<PrivateNoteEntity | null>;
}
