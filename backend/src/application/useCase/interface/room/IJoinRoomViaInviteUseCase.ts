import { JoinRoomSnapshotDTO, JoinViaInviteDTO } from '../../../dto/RoomDTO';

export interface IJoinRoomViaInviteUseCase {
  execute(data: JoinViaInviteDTO): Promise<JoinRoomSnapshotDTO>;
}
