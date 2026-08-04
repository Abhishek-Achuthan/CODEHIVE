import { injectable, inject } from 'tsyringe';

import {
  GetPrivateNoteDTO,
  IGetPrivateNoteUseCase,
} from '../../interface/notes/privateNote/IGetPrivateNoteUseCase';
import { PrivateNoteEntity } from '../../../../domain/entities/room/PrivateNoteEntity';
import type { IPrivateNoteRepository } from '../../../../domain/interfaces/IPrivateNoteRepository';
import { RoomAuthorizationService } from '../../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../../domain/types/CapabilityKey';

@injectable()
export class GetPrivateNoteUseCase implements IGetPrivateNoteUseCase {
  constructor(
    @inject('IPrivateNoteRepository') private readonly _noteRepo: IPrivateNoteRepository,
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: GetPrivateNoteDTO): Promise<PrivateNoteEntity | null> {
    const { roomId, userId } = data;
    await this._roomAuthorizationService.assertCapability(
      roomId,
      userId,
      CapabilityKey.ROOM_PRIVATE_NOTES_VIEW,
      'read',
    );

    return this._noteRepo.findByRoomAndUser(roomId, userId);
  }
}
