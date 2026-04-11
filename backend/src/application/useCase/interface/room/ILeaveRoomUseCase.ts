import { JoinRoomDTO } from '../../../dto/RoomDTO';

export interface ILeaveRoomUseCase {
    execute(data: JoinRoomDTO): Promise<void>;
}
