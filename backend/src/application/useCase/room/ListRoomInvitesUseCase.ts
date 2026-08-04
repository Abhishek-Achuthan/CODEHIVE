import { inject, injectable } from 'tsyringe';
import { IListRoomInvitesUseCase } from '../interface/room/IListRoomInvitesUseCase';
import { RoomInviteResponseDTO } from '../../dto/RoomDTO';
import type { IRoomInviteRepository } from '../../../domain/interfaces/IRoomInviteRepository';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { RoomInviteMapper } from '../../mapper/RoomInviteMapper';

@injectable()
export class ListRoomInvitesUseCase implements IListRoomInvitesUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('IRoomInviteRepository')
    private readonly _inviteRepository: IRoomInviteRepository,
  ) {}

  async execute(roomId: string, hostUserId: string): Promise<RoomInviteResponseDTO[]> {
    await this._roomAuthorizationService.assertHost(roomId, hostUserId);

    const invites = await this._inviteRepository.listByRoomId(roomId);

    return invites.map((invite) => RoomInviteMapper.toResponse(invite));
  }
}
