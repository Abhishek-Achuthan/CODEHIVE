import { PaginationResult } from "../../../../domain/types/PaginationResult";
import { GetPublicRoomsDTO, GetPublicRoomsResponseDTO } from "../../../dto/RoomDTO";

export interface IGetPublicRoomsUseCase {
    execute(data:GetPublicRoomsDTO):Promise<PaginationResult<GetPublicRoomsResponseDTO>>   
}