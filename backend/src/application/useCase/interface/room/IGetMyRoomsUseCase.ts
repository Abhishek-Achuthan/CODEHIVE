import { GetPublicRoomsDTO, GetPublicRoomsResponseDTO } from '../../../dto/RoomDTO';
import { PaginationResult } from '../../../../domain/types/PaginationResult';

export interface IGetMyRoomsUseCase {
  execute(
    hostId: string,
    data: GetPublicRoomsDTO,
  ): Promise<PaginationResult<GetPublicRoomsResponseDTO>>;
}
