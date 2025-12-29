import { AiChatMessageEntity } from '../entities/qna/AiChatMessageEntity'

export interface IAiChatMessageRepository {
  save(data: {
    sessionId: string
    role: AiChatMessageEntity['role']
    content: string
  }): Promise<AiChatMessageEntity>
  getRecentBySession(
    sessionId: string,
    limit: number
  ): Promise<AiChatMessageEntity[]>
  deleteBySessionId(sessionId: string): Promise<void>
  deleteBySessionIds(sessionIds: string[]): Promise<void>
};
