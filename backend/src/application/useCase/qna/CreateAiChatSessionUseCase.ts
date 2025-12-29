import { inject, injectable } from 'tsyringe';
import type { IAiChatSessionRepository } from '../../../domain/interfaces/IAiChatSessionRepository';
import type { IAiChatMessageRepository } from '../../../domain/interfaces/IAiChatMessageRepository';
import type { ICreateAiChatSessionUseCase } from '../interface/qna/ICreateAiChatSessionUseCase';
import { AiChatSessionEntity } from '../../../domain/entities/qna/AiChatSessionEntity';

@injectable()
export class CreateAiChatSessionUseCase implements ICreateAiChatSessionUseCase {
  constructor(
    @inject('IAiChatSessionRepository')
    private readonly _sessionRepo: IAiChatSessionRepository,
    @inject('IAiChatMessageRepository')
    private readonly _messageRepo: IAiChatMessageRepository
  ) {}

  async execute(userId: string): Promise<AiChatSessionEntity> {
    const session = await this._sessionRepo.create(userId);

    const oldIds = await this._sessionRepo.listOldSessionIdsByUserId(userId, 10);
    await this._messageRepo.deleteBySessionIds(oldIds);
    await this._sessionRepo.deleteByIds(oldIds);

    return session;
  }
}
