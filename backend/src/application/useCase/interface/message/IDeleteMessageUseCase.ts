export interface DeleteMessageDTO {
  messageId: string;
  userId: string;
}

export interface IDeleteMessageUseCase {
  execute(data: DeleteMessageDTO): Promise<void>;
}
