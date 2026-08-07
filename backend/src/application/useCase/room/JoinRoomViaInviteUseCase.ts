import { inject, injectable } from 'tsyringe';
import { IJoinRoomViaInviteUseCase } from '../interface/room/IJoinRoomViaInviteUseCase';
import { JoinRoomSnapshotDTO, JoinViaInviteDTO } from '../../dto/RoomDTO';
import { RoomInviteService } from '../../services/RoomInviteService';
import type { IJoinRoomUseCase } from '../interface/room/IJoinRoomUseCase';

@injectable()
export class JoinRoomViaInviteUseCase implements IJoinRoomViaInviteUseCase {
  constructor(
    @inject(RoomInviteService)
    private readonly _roomInviteService: RoomInviteService,
    @inject('IJoinRoomUseCase')
    private readonly _joinRoomUseCase: IJoinRoomUseCase,
  ) {}

  async execute(data: JoinViaInviteDTO): Promise<JoinRoomSnapshotDTO> {
    const invite = await this._roomInviteService.validateInviteCode(data.inviteCode);

    return this._joinRoomUseCase.execute({
      roomId: invite.roomId,
      userId: data.userId,
      inviteCode: data.inviteCode,
    });
  }
}
