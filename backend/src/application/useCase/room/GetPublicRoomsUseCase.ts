import { inject, injectable } from 'tsyringe';
import { IGetPublicRoomsUseCase } from '../interface/room/IGetPublicRoomsUseCase';
import { GetPublicRoomsDTO, RoomListItemDTO } from '../../dto/RoomDTO';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { RoomMapper } from '../../mapper/RoomMapper';

@injectable()
export class GetPublicRoomsUseCase implements IGetPublicRoomsUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(
    data: GetPublicRoomsDTO,
  ): Promise<PaginationResult<RoomListItemDTO>> {
    const result = await this.roomRepository.findAllPublic(data.page, data.limit, data.search);

    return {
      ...result,
      items: result.items.map(RoomMapper.toRoomListItem),
    };
  }
}