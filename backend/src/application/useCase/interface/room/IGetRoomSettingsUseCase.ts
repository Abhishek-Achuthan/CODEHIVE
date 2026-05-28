import { RoomSettingsResponseDTO } from '../../../dto/RoomSettingsDTO';

export interface IGetRoomSettingsUseCase {
  execute(roomId: string, userId: string): Promise<RoomSettingsResponseDTO>;
}
