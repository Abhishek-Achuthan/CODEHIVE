import { inject, injectable } from 'tsyringe';

import {
  ISavePrivateNoteUseCase,
  SavePrivateNoteDTO,
} from '../../interface/notes/privateNote/ISavePrivateNoteUseCase';
import { PrivateNoteEntity } from '../../../../domain/entities/room/PrivateNoteEntity';
import type { IPrivateNoteRepository } from '../../../../domain/interfaces/IPrivateNoteRepository';
import { RoomAuthorizationService } from '../../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../../domain/types/CapabilityKey';

@injectable()
export class SavePrivateNoteUseCase implements ISavePrivateNoteUseCase {
  constructor(
    @inject('IPrivateNoteRepository')
    private readonly _noteRepo: IPrivateNoteRepository,

    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: SavePrivateNoteDTO): Promise<PrivateNoteEntity> {
    const { userId, roomId, content } = data;
    await this._roomAuthorizationService.assertCapability(
      roomId,
      userId,
      CapabilityKey.ROOM_NOTES_EDIT,
    );

    const existingNote = await this._noteRepo.findByRoomAndUser(roomId, userId);

    const note: PrivateNoteEntity = {
      ...(existingNote?.id && { id: existingNote.id }),
      roomId,
      userId,
      content,
      createdAt: existingNote?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    return this._noteRepo.upsert(note);
  }
}
