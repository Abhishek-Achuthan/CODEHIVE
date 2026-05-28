import { inject, injectable } from 'tsyringe';
import { IGetMyRoomsUseCase } from '../interface/room/IGetMyRoomsUseCase';
import { GetPublicRoomsDTO, GetPublicRoomsResponseDTO } from '../../dto/RoomDTO';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { RoomMapper } from '../../mapper/RoomMapper';

@injectable()
export class GetMyRoomsUseCase implements IGetMyRoomsUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
  ) {}

  async execute(
    hostId: string,
    data: GetPublicRoomsDTO,
  ): Promise<PaginationResult<GetPublicRoomsResponseDTO>> {
    const result = await this._roomRepository.findAllByHostId(
      hostId,
      data.page,
      data.limit,
    );

    return {
      ...result,
      items: result.items.map(RoomMapper.toPublicRoomResponse),
    };
  }
}
