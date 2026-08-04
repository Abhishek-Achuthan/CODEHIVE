import { GetMyRoomsDTO, RoomListItemDTO } from '../../../dto/RoomDTO';
import { PaginationResult } from '../../../../domain/types/PaginationResult';

export interface IGetMyRoomsUseCase {
  execute(
    hostId: string,
    data: GetMyRoomsDTO,
  ): Promise<PaginationResult<RoomListItemDTO>>;
}
