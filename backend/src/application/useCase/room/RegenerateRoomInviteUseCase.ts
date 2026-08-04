import { inject, injectable } from 'tsyringe';
import { IRegenerateRoomInviteUseCase } from '../interface/room/IRegenerateRoomInviteUseCase';
import { RoomInviteResponseDTO } from '../../dto/RoomDTO';
import { CreateRoomInviteUseCase } from './CreateRoomInviteUseCase';

@injectable()
export class RegenerateRoomInviteUseCase implements IRegenerateRoomInviteUseCase {
  constructor(
    @inject(CreateRoomInviteUseCase)
    private readonly _createRoomInvite: CreateRoomInviteUseCase,
  ) {}

  async execute(roomId: string, hostUserId: string): Promise<RoomInviteResponseDTO> {
    return this._createRoomInvite.execute(roomId, hostUserId);
  }
}
