import { JoinRoomDTO, JoinRoomResponseDTO } from "../../../dto/RoomDTO";

export interface IJoinRoomUseCase{
    execute(data:JoinRoomDTO):Promise<JoinRoomResponseDTO>
}