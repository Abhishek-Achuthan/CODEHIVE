import { RoomEntity } from '../../../../domain/entities/room/RoomEntity';
import { RoomVisibility } from '../../../../domain/types/RoomVisibility';

export interface UpdateRoomDetailsParams {
  roomId: string;
  hostUserId: string;
  title?: string;
  description?: string;
  visibility?: RoomVisibility;
}

export interface IUpdateRoomDetailsUseCase {
  execute(params: UpdateRoomDetailsParams): Promise<RoomEntity>;
}
