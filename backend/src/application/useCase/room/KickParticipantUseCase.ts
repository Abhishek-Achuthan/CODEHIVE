import { inject, injectable } from 'tsyringe';
import { IKickParticipantUseCase } from '../interface/room/IKickParticipantUseCase';
import { KickParticipantDTO } from '../../dto/RoomDTO';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IRoomBanRepository } from '../../../domain/interfaces/IRoomBanRepository';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { RoomRole } from '../../../domain/types/RoomRole';

@injectable()
export class KickParticipantUseCase implements IKickParticipantUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('IParticipantRepository')
    private readonly _participantRepository: IParticipantRepository,
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject('IRoomBanRepository')
    private readonly _roomBanRepository: IRoomBanRepository,
  ) {}

  async execute(data: KickParticipantDTO): Promise<void> {
    const room = await this._roomAuthorizationService.assertHost(
      data.roomId,
      data.hostUserId,
    );

    if (data.targetUserId === data.hostUserId) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.CANNOT_KICK_SELF);
    }

    if (data.targetUserId === room.hostId) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.CANNOT_KICK_HOST);
    }

    const participant = await this._participantRepository.findByRoomAndUser(
      data.roomId,
      data.targetUserId,
    );

    if (!participant) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.PARTICIPANT_NOT_FOUND);
    }

    if (participant.role === RoomRole.HOST) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.CANNOT_KICK_HOST);
    }

    const alreadyBanned = await this._roomBanRepository.exists(
      data.roomId,
      data.targetUserId,
    );

    if (!alreadyBanned) {
      await this._roomBanRepository.create({
        roomId: data.roomId,
        userId: data.targetUserId,
        bannedBy: data.hostUserId,
        bannedAt: new Date(),
      });
    }

    await this._participantRepository.removeByRoomAndUser(
      data.roomId,
      data.targetUserId,
    );

    await this._roomRepository.decrementParticipantCount(data.roomId);
  }
}
