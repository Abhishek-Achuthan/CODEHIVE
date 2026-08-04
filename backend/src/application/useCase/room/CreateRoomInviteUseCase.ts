import { inject, injectable } from 'tsyringe';
import { ICreateRoomInviteUseCase } from '../interface/room/ICreateRoomInviteUseCase';
import { RoomInviteResponseDTO } from '../../dto/RoomDTO';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { RoomInviteService } from '../../services/RoomInviteService';
import { RoomInviteMapper } from '../../mapper/RoomInviteMapper';

@injectable()
export class CreateRoomInviteUseCase implements ICreateRoomInviteUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject(RoomInviteService)
    private readonly _roomInviteService: RoomInviteService,
  ) {}

  async execute(roomId: string, hostUserId: string): Promise<RoomInviteResponseDTO> {
    await this._roomAuthorizationService.assertHost(roomId, hostUserId);

    const { invite, joinUrl } = await this._roomInviteService.createHostInvite(
      roomId,
      hostUserId,
    );

    return RoomInviteMapper.toResponse(invite, joinUrl);
  }
}
