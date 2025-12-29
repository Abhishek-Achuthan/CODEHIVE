import { AiChatSessionEntity } from '../../../../domain/entities/qna/AiChatSessionEntity';

export interface IListAiChatSessionsUseCase {
  execute(userId: string, limit?: number): Promise<AiChatSessionEntity[]>;
}
