import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { GetPublicRoomsDTO, RoomListItemDTO } from '../../../dto/RoomDTO';

export interface IGetPublicRoomsUseCase {
  execute(data: GetPublicRoomsDTO): Promise<PaginationResult<RoomListItemDTO>>;
}
