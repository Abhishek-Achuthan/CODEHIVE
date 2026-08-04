import { inject, injectable } from 'tsyringe';

import {
  ISavePublicNoteUseCase,
  SavePublicNoteDTO,
} from '../../interface/notes/ISavePublicNoteUseCase';
import { PublicNoteEntity } from '../../../../domain/entities/room/PublicNoteEntity';
import type { IPublicNoteRepository } from '../../../../domain/interfaces/IPublicNoteRepository';
import { CapabilityKey } from '../../../../domain/types/CapabilityKey';
import { RoomAuthorizationService } from '../../../services/RoomAuthorizationService';

@injectable()
export class SavePublicNoteUseCase implements ISavePublicNoteUseCase {
  constructor(
    @inject('IPublicNoteRepository') private readonly _publicNoteRepo: IPublicNoteRepository,
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: SavePublicNoteDTO): Promise<PublicNoteEntity> {
    const { roomId, userId, content } = data;
    await this._roomAuthorizationService.assertCapability(
      roomId,
      userId,
      CapabilityKey.ROOM_PUBLIC_NOTES_EDIT,
    );

    return this._publicNoteRepo.upsert(roomId, content, userId);
  }
}
