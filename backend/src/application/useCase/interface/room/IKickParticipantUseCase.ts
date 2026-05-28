import { KickParticipantDTO } from '../../../dto/RoomDTO';

export interface IKickParticipantUseCase {
  execute(data: KickParticipantDTO): Promise<void>;
}
