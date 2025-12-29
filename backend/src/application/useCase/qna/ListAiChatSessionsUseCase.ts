import { inject, injectable } from 'tsyringe';
import type { IListAiChatSessionsUseCase } from '../interface/qna/IListAiChatSessionsUseCase';
import type { IAiChatSessionRepository } from '../../../domain/interfaces/IAiChatSessionRepository';
import { AiChatSessionEntity } from '../../../domain/entities/qna/AiChatSessionEntity';

@injectable()
export class ListAiChatSessionsUseCase implements IListAiChatSessionsUseCase {
  constructor(
    @inject('IAiChatSessionRepository')
    private readonly _sessionRepo: IAiChatSessionRepository
  ) {}

  async execute(userId: string, limit: number = 10): Promise<AiChatSessionEntity[]> {
    return this._sessionRepo.listByUserId(userId, limit);
  }
}
