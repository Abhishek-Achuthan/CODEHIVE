import { RoomInviteResponseDTO } from '../../../dto/RoomDTO';

export interface IRegenerateRoomInviteUseCase {
  execute(roomId: string, hostUserId: string): Promise<RoomInviteResponseDTO>;
}
