import { inject, injectable } from 'tsyringe';

import { IUpdateParticipantOverridesUseCase } from '../interface/room/IUpdateParticipantOverridesUseCase';
import {
  UpdateParticipantOverridesDTO,
  UpdateParticipantOverridesResponseDTO,
} from '../../dto/RoomDTO';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import type { IRoomEventEmitter } from '../../ports/realtime/IRoomEventEmitter';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { HocuspocusService } from '../../../infrastructure/realtime/HocuspocusService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';
import { RoomRole } from '../../../domain/types/RoomRole';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

const VALID_CAPABILITY_KEYS = new Set<string>(Object.values(CapabilityKey));

@injectable()
export class UpdateParticipantOverridesUseCase
  implements IUpdateParticipantOverridesUseCase
{
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('IParticipantRepository')
    private readonly _participantRepository: IParticipantRepository,
    @inject('IRoomEventEmitter')
    private readonly _roomEventEmitter: IRoomEventEmitter,
    @inject(HocuspocusService)
    private readonly _hocuspocusService: HocuspocusService,
  ) {}

  async execute(
    data: UpdateParticipantOverridesDTO,
  ): Promise<UpdateParticipantOverridesResponseDTO> {
    const { roomId, executorUserId, targetUserId, overrides } = data;

    // 1. Validate executor has ROOM_MANAGE_PERMISSIONS
    await this._roomAuthorizationService.assertCapability(
      roomId,
      executorUserId,
      CapabilityKey.ROOM_MANAGE_PERMISSIONS,
    );

    // 2. Validate all incoming capability keys are known
    const invalidKeys = Object.keys(overrides).filter(
      (key) => !VALID_CAPABILITY_KEYS.has(key),
    );
    if (invalidKeys.length > 0) {
      throw new BadRequestError(
        `Invalid capability keys: ${invalidKeys.join(', ')}`,
      );
    }

    // 3. Validate target participant exists in the room
    const targetParticipant = await this._participantRepository.findByRoomAndUser(
      roomId,
      targetUserId,
    );

    if (!targetParticipant) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.PARTICIPANT_NOT_FOUND);
    }

    // 4. Prevent overriding the HOST
    if (targetParticipant.role === RoomRole.HOST) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.CANNOT_OVERRIDE_HOST);
    }

    // 5. Persist the merged flat overrides
    const updated = await this._participantRepository.updateOverrides(
      roomId,
      targetUserId,
      overrides,
    );

    // 6. Sync active collaboration connections (readOnly) without requiring reconnect
    await this._hocuspocusService.syncCollaborationWriteAccess(roomId, targetUserId);

    // 7. Emit realtime event so all room clients can refresh permissions
    this._roomEventEmitter.emitPermissionsUpdated(roomId, {
      roomId,
      userId: targetUserId,
      overrides: updated.overrides as Record<string, boolean>,
    });

    return {
      userId: targetUserId,
      overrides: updated.overrides,
    };
  }
}
