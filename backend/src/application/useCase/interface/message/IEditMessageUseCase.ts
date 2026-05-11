export interface EditMessageDTO {
  messageId: string;
  senderId: string;
  content: string;
}

export interface IEditMessageUseCase {
  execute(data: EditMessageDTO): Promise<void>;
}
