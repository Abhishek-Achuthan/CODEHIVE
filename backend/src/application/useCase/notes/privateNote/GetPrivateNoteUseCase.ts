import { injectable, inject } from 'tsyringe';

import {
  GetPrivateNoteDTO,
  IGetPrivateNoteUseCase,
} from '../../interface/notes/privateNote/IGetPrivateNoteUseCase';
import { PrivateNoteEntity } from '../../../../domain/entities/room/PrivateNoteEntity';
import type { IPrivateNoteRepository } from '../../../../domain/interfaces/IPrivateNoteRepository';

@injectable()
export class GetPrivateNoteUseCase implements IGetPrivateNoteUseCase {
  constructor(
    @inject('IPrivateNoteRepository') private readonly _noteRepo: IPrivateNoteRepository,
  ) {}

  async execute(data: GetPrivateNoteDTO): Promise<PrivateNoteEntity | null> {
    const { roomId, userId } = data;

    return this._noteRepo.findByRoomAndUser(roomId, userId);
  }
}
