import { EditMessageDTO, EditMessageResultDTO } from "../../../dto/MessageDTO";

export interface IEditMessageUseCase {
  execute(data: EditMessageDTO): Promise<EditMessageResultDTO>;
}
