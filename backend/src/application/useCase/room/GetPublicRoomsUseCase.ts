import { inject, injectable } from "tsyringe";
import { IGetPublicRoomsUseCase } from "../interface/room/IGetPublicRoomsUseCase";
import { GetPublicRoomsDTO, GetPublicRoomsResponseDTO } from "../../dto/RoomDTO";
import { PaginationResult } from "../../../domain/types/PaginationResult";
import type { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";

@injectable()
export class GetPublicRoomsUseCase implements IGetPublicRoomsUseCase {
    constructor(
        @inject('IRoomRepository')
        private readonly roomRepository: IRoomRepository,
    ) {}

    async execute(data: GetPublicRoomsDTO): Promise<PaginationResult<GetPublicRoomsResponseDTO>> {
        const rooms = await this.roomRepository.findAllPublic(data.page,data.limit);
        return rooms;
    }
}