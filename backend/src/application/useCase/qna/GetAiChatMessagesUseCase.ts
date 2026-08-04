import { inject, injectable } from 'tsyringe';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IAiChatSessionRepository } from '../../../domain/interfaces/IAiChatSessionRepository';
import type { IAiChatMessageRepository } from '../../../domain/interfaces/IAiChatMessageRepository';
import type { IGetAiChatMessagesUseCase } from '../interface/qna/IGetAiChatMessagesUseCase';
import { AiChatMessageEntity } from '../../../domain/entities/qna/AiChatMessageEntity';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class GetAiChatMessagesUseCase implements IGetAiChatMessagesUseCase {
  constructor(
    @inject('IAiChatSessionRepository')
    private readonly _sessionRepo: IAiChatSessionRepository,
    @inject('IAiChatMessageRepository')
    private readonly _messageRepo: IAiChatMessageRepository
  ) {}

  async execute(
    userId: string,
    sessionId: string,
    limit: number = 50
  ): Promise<AiChatMessageEntity[]> {
    const session = await this._sessionRepo.findById(sessionId);

    if (!session) throw new NotFoundError(ERROR_MESSAGES.QnA.CHAT_SESSION_NOT_FOUND);

    if (session.userId !== userId) throw new ForbiddenError(ERROR_MESSAGES.AUTH.FORBIDDEN);

    return this._messageRepo.getRecentBySession(sessionId, limit);
  }
}
