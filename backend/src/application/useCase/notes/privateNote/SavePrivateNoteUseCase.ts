import { inject, injectable } from 'tsyringe';
import { ISavePrivateNoteUseCase } from '../../interface/notes/privateNote/ISavePrivateNoteUseCase';
import { PrivateNoteEntity } from '../../../../domain/entities/room/PrivateNoteEntity';
import { NotFoundError } from '../../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../../shared/constants/errorMessages';
import type { IPrivateNoteRepository } from '../../../../domain/interfaces/IPrivateNoteRepository';
import type { IRoomRepository } from '../../../../domain/interfaces/IRoomRepository';

@injectable()
export class SavePrivateNoteUseCase
  implements ISavePrivateNoteUseCase
{
  constructor(
    @inject('IPrivateNoteRepository')
    private readonly _noteRepo: IPrivateNoteRepository,

    @inject('IRoomRepository')
    private readonly _roomRepo: IRoomRepository
  ) {}

  async execute(
    userId: string,
    roomId: string,
    content: Record<string, unknown>
  ): Promise<PrivateNoteEntity> {
    const room = await this._roomRepo.find(roomId);

    if (!room) {
      throw new NotFoundError(
        ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND
      );
    }

    const existingNote =
      await this._noteRepo.findByRoomAndUser(
        roomId,
        userId
      );

    const note: PrivateNoteEntity = {
      id: existingNote?.id,
      roomId,
      userId,
      content,
      createdAt:existingNote?.createdAt? existingNote.createdAt : new Date(),
      updatedAt: new Date(),
    };

    return await this._noteRepo.upsert(note);
  }
}
