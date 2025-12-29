import { AiChatMessageEntity } from '../../../../domain/entities/qna/AiChatMessageEntity';

export interface IGetAiChatMessagesUseCase {
  execute(userId: string, sessionId: string, limit?: number): Promise<AiChatMessageEntity[]>;
}
