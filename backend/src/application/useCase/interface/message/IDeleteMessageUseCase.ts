import { DeleteMessageDTO, DeleteMessageResultDTO } from "../../../dto/MessageDTO";

export interface IDeleteMessageUseCase {
  execute(data: DeleteMessageDTO): Promise<DeleteMessageResultDTO>;
}
