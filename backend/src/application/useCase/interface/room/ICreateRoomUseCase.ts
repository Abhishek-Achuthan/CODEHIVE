import { CreateRoomDTO, CreateRoomResponseDTO } from '../../../dto/RoomDTO';

export interface ICreateRoomUseCase {
    execute(data:CreateRoomDTO):Promise<CreateRoomResponseDTO>
}