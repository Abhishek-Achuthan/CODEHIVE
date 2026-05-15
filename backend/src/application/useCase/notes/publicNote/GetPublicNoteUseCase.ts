import { inject, injectable } from 'tsyringe';

import {
  GetPublicNoteDTO,
  IGetPublicNoteUseCase,
} from '../../interface/notes/privateNote/IGetPublicNoteUseCase';
import type { IPublicNoteRepository } from '../../../../domain/interfaces/IPublicNoteRepository';
import { PublicNoteEntity } from '../../../../domain/entities/room/PublicNoteEntity';
import { NotFoundError } from '../../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../../shared/constants/errorMessages';
import { PermissionService } from '../../../../domain/services/PermissionService';
import { CapabilityKey } from '../../../../domain/types/CapabilityKey';
import type { IParticipantRepository } from '../../../../domain/interfaces/IParticipantRepository';
import type { IRoomRepository } from '../../../../domain/interfaces/IRoomRepository';
import { ForbiddenError } from '../../../../core/errors/ForbiddenError';

@injectable()
export class GetPublicNoteUseCase implements IGetPublicNoteUseCase {
  constructor(
    @inject('IPublicNoteRepository') private readonly _publicNoteRepo: IPublicNoteRepository,
    @inject('IParticipantRepository') private readonly _participantRepo: IParticipantRepository,
    @inject('IRoomRepository') private readonly _roomRepo: IRoomRepository,
    @inject('PermissionService') private readonly _permissionService: PermissionService,
  ) {}

  async execute(data: GetPublicNoteDTO): Promise<PublicNoteEntity | null> {
    const { roomId, userId } = data;
    const room = await this._roomRepo.find(roomId);

    if (!room) throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);

    const participant = await this._participantRepo.findByRoomAndUser(roomId, userId);

    if (!participant) throw new NotFoundError(ERROR_MESSAGES.ROOM.PARTICIPANT_NOT_FOUND);

    const canView = this._permissionService.canPerform(
      participant,
      room.featureSnapshot,
      CapabilityKey.ROOM_NOTES_VIEW,
    );

    if (!canView) throw new ForbiddenError(ERROR_MESSAGES.ROOM.FORBIDDEN);

    const note = await this._publicNoteRepo.findByRoomId(roomId);

    return note;
  }
}
