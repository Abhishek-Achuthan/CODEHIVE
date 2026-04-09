import { SendMessageDTO, SendMessageResponseDTO } from "../../../dto/MessageDTO";

export interface ISendMessageUseCase {
  execute(data: SendMessageDTO): Promise<SendMessageResponseDTO>;
}