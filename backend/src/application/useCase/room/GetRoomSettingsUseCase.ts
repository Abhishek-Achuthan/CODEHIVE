import { inject, injectable } from 'tsyringe';
import { IGetRoomSettingsUseCase } from '../interface/room/IGetRoomSettingsUseCase';
import { RoomSettingsResponseDTO } from '../../dto/RoomSettingsDTO';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { IRoomInviteRepository } from '../../../domain/interfaces/IRoomInviteRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { RoomVisibility } from '../../../domain/types/RoomVisibility';
import { RoomAdmissionPolicy } from '../../../domain/types/RoomAdmissionPolicy';
import { RoomInviteType } from '../../../domain/types/RoomInviteType';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class GetRoomSettingsUseCase implements IGetRoomSettingsUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,

    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @inject('IRoomInviteRepository')
    private readonly _inviteRepository: IRoomInviteRepository,

    @inject('ISessionRepository')
    private readonly _sessionRepo: ISessionRepository,

    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(roomId: string, userId: string): Promise<RoomSettingsResponseDTO> {
    await this._roomAuthorizationService.assertParticipant(roomId, userId, 'read');

    const room = await this._roomRepository.find(roomId);

    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    const host = await this._userRepository.find(room.hostId);

    if (!host) {
      throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    const isHost = room.hostId === userId;
    const isInviteOnlyRoom =
      room.visibility === RoomVisibility.PRIVATE &&
      (room.admissionPolicy === RoomAdmissionPolicy.INVITE_ONLY ||
        room.admissionPolicy === RoomAdmissionPolicy.BOOKING_ONLY);

    const canManageInviteLink = isHost && isInviteOnlyRoom;

    const response: RoomSettingsResponseDTO = {
      id: room.id,
      title: room.title,
      ...(room.description !== undefined ? { description: room.description } : {}),
      visibility: room.visibility,
      createdAt: room.createdAt.toISOString(),
      host: {
        id: host.id,
        firstName: host.firstName,
        lastName: host.lastName,
        role: host.role,
        ...(host.avatarUrl !== undefined ? { avatarUrl: host.avatarUrl } : {}),
      },
      isHost,
      canManageInviteLink,
    };

    if (!canManageInviteLink) {
      return response;
    }

    if (room.sessionId) {
      const session = await this._sessionRepo.find(room.sessionId);

      if (session?.joinUrl) {
        return { ...response, joinUrl: session.joinUrl };
      }

      const sessionInvite = await this._inviteRepository.findActiveBySessionId(
        room.sessionId,
      );

      return {
        ...response,
        ...(sessionInvite ? { hasActiveInvite: true } : {}),
      };
    }

    const activeInvite = await this._inviteRepository.findActiveByRoomId(
      roomId,
      RoomInviteType.HOST_MANAGED,
    );

    return {
      ...response,
      ...(activeInvite ? { hasActiveInvite: true } : {}),
    };
  }
}
