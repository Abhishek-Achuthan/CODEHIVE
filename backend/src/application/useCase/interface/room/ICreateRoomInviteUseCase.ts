import { RoomInviteResponseDTO } from '../../../dto/RoomDTO';

export interface ICreateRoomInviteUseCase {
  execute(roomId: string, hostUserId: string): Promise<RoomInviteResponseDTO>;
}
