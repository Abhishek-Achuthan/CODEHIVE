import { JoinRoomDTO, JoinRoomSnapshotDTO } from '../../../dto/RoomDTO';

export interface IJoinRoomUseCase{
    execute(data:JoinRoomDTO):Promise<JoinRoomSnapshotDTO>
}