import { EndRoomDTO } from '../../../dto/RoomDTO';

export interface IEndRoomUseCase {
  execute(data: EndRoomDTO): Promise<void>;
}
