import { inject, injectable } from 'tsyringe';

import {
  GetPublicNoteDTO,
  IGetPublicNoteUseCase,
} from '../../interface/notes/privateNote/IGetPublicNoteUseCase';
import type { IPublicNoteRepository } from '../../../../domain/interfaces/IPublicNoteRepository';
import { PublicNoteEntity } from '../../../../domain/entities/room/PublicNoteEntity';
import { CapabilityKey } from '../../../../domain/types/CapabilityKey';
import { RoomAuthorizationService } from '../../../services/RoomAuthorizationService';

@injectable()
export class GetPublicNoteUseCase implements IGetPublicNoteUseCase {
  constructor(
    @inject('IPublicNoteRepository') private readonly _publicNoteRepo: IPublicNoteRepository,
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: GetPublicNoteDTO): Promise<PublicNoteEntity | null> {
    const { roomId, userId } = data;
    await this._roomAuthorizationService.assertCapability(
      roomId,
      userId,
      CapabilityKey.ROOM_NOTES_VIEW,
    );

    const note = await this._publicNoteRepo.findByRoomId(roomId);

    return note;
  }
}
