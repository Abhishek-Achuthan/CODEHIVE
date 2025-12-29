import { AiChatSessionEntity } from '../../../../domain/entities/qna/AiChatSessionEntity';

export interface ICreateAiChatSessionUseCase {
  execute(userId: string): Promise<AiChatSessionEntity>;
}
