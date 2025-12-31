import { AiChatSessionEntity } from '../entities/qna/AiChatSessionEntity'

export interface IAiChatSessionRepository {
  findById(sessionId: string): Promise<AiChatSessionEntity | null>;
  findByUserId(userId: string): Promise<AiChatSessionEntity | null>;
  listByUserId(userId: string, limit: number): Promise<AiChatSessionEntity[]>;
  listOldSessionIdsByUserId(userId: string, keepLimit: number): Promise<string[]>;
  create(userId: string): Promise<AiChatSessionEntity>;
  markActive(sessionId: string): Promise<void>;
  deleteByIds(sessionIds: string[]): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
};