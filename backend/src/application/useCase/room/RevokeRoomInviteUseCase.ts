import { inject, injectable } from 'tsyringe';
import { IRevokeRoomInviteUseCase } from '../interface/room/IRevokeRoomInviteUseCase';
import type { IRoomInviteRepository } from '../../../domain/interfaces/IRoomInviteRepository';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class RevokeRoomInviteUseCase implements IRevokeRoomInviteUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('IRoomInviteRepository')
    private readonly _inviteRepository: IRoomInviteRepository,
  ) {}

  async execute(roomId: string, inviteId: string, hostUserId: string): Promise<void> {
    await this._roomAuthorizationService.assertHost(roomId, hostUserId);

    const revoked = await this._inviteRepository.revokeById(inviteId);

    if (!revoked || revoked.roomId !== roomId) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.INVITE_INVALID);
    }
  }
}
