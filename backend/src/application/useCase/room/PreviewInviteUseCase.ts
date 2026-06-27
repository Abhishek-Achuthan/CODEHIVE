import { inject, injectable } from 'tsyringe';
import { IPreviewInviteUseCase } from '../interface/room/IPreviewInviteUseCase';
import { InvitePreviewResponseDTO } from '../../dto/RoomDTO';
import { RoomInviteService } from '../../services/RoomInviteService';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IRoomBanRepository } from '../../../domain/interfaces/IRoomBanRepository';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class PreviewInviteUseCase implements IPreviewInviteUseCase {
  constructor(
    @inject(RoomInviteService)
    private readonly _roomInviteService: RoomInviteService,
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject('IRoomBanRepository')
    private readonly _roomBanRepository: IRoomBanRepository,
    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(inviteCode: string, userId?: string): Promise<InvitePreviewResponseDTO> {
    let invite;
    try {
      invite = await this._roomInviteService.validateInviteCode(inviteCode);
    } catch {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.INVITE_INVALID);
    }

    const room = await this._roomRepository.find(invite.roomId);

    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    const host = await this._userRepository.find(room.hostId);
    const hostName = host
      ? `${host.firstName} ${host.lastName}`
      : 'Host';

    const isFull = room.participantCount >= room.maxParticipants;

    let canJoin = !isFull;

    if (userId !== undefined) {
      const ban = await this._roomBanRepository.findByRoomAndUser(room.id, userId);
      if (ban) {
        if (invite.createdAt <= ban.bannedAt) {
          canJoin = false;
        }
      }
    }

    return {
      roomId: room.id,
      title: room.title,
      hostName,
      isFull,
      canJoin,
    };
  }
}
