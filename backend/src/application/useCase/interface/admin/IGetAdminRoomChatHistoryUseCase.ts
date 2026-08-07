import { SendMessageResponseDTO } from '../../../dto/MessageDTO';

export interface IGetAdminRoomChatHistoryUseCase {
  execute(roomId: string): Promise<SendMessageResponseDTO[]>;
}
