import { RoomInviteResponseDTO } from '../../../dto/RoomDTO';

export interface IListRoomInvitesUseCase {
  execute(roomId: string, hostUserId: string): Promise<RoomInviteResponseDTO[]>;
}
