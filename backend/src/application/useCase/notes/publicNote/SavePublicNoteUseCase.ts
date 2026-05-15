import { inject, injectable } from 'tsyringe';

import {
  ISavePublicNoteUseCase,
  SavePublicNoteDTO,
} from '../../interface/notes/ISavePublicNoteUseCase';
import { PublicNoteEntity } from '../../../../domain/entities/room/PublicNoteEntity';
import { NotFoundError } from '../../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../../shared/constants/errorMessages';
import type { IRoomRepository } from '../../../../domain/interfaces/IRoomRepository';
import type { IPublicNoteRepository } from '../../../../domain/interfaces/IPublicNoteRepository';
import type { IParticipantRepository } from '../../../../domain/interfaces/IParticipantRepository';
import type { PermissionService } from '../../../../domain/services/PermissionService';
import { CapabilityKey } from '../../../../domain/types/CapabilityKey';
import { ForbiddenError } from '../../../../core/errors/ForbiddenError';

@injectable()
export class SavePublicNoteUseCase implements ISavePublicNoteUseCase {
  constructor(
    @inject('IPublicNoteRepository') private readonly _publicNoteRepo: IPublicNoteRepository,
    @inject('IRoomRepository') private readonly _roomRepo: IRoomRepository,
    @inject('IParticipantRepository') private readonly _participantRepo: IParticipantRepository,
    @inject('PermissionService') private readonly _permissionService: PermissionService,
  ) {}

  async execute(data: SavePublicNoteDTO): Promise<PublicNoteEntity> {
    const { roomId, userId, content } = data;
    const room = await this._roomRepo.find(roomId);

    if (!room) throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);

    const participant = await this._participantRepo.findByRoomAndUser(roomId, userId);

    if (!participant) throw new NotFoundError(ERROR_MESSAGES.ROOM.PARTICIPANT_NOT_FOUND);

    const canEdit = this._permissionService.canPerform(
      participant,
      room.featureSnapshot,
      CapabilityKey.ROOM_CODE_EDIT,
    );

    if (!canEdit) throw new ForbiddenError(ERROR_MESSAGES.ROOM.FORBIDDEN);

    return this._publicNoteRepo.upsert(roomId, content, userId);
  }
}
