import { inject,injectable } from 'tsyringe';
import { IAiAssistantUseCase } from '../interface/qna/IAiAssistantUseCase';
import { type  IAIService } from '../../ports/ai/IAIService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IAiChatSessionRepository } from '../../../domain/interfaces/IAiChatSessionRepository';
import type { IAiChatMessageRepository } from '../../../domain/interfaces/IAiChatMessageRepository';
import type { AiAssistInputDTO, AiAssistOutputDTO } from '../../dto/AiChatDTO';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';

@injectable()
export class AiAssistantUseCase implements IAiAssistantUseCase {
    constructor(
        @inject('IAIService') private readonly _aiService : IAIService,
        @inject('IAiChatSessionRepository') private readonly _sessionRepo: IAiChatSessionRepository,
        @inject('IAiChatMessageRepository') private readonly _messageRepo: IAiChatMessageRepository
    ) {}

    async execute(data: AiAssistInputDTO): Promise<AiAssistOutputDTO> {

        const { userId, prompt, sessionId } = data;

        let session = null;
        let createdNewSession = false;

        if (sessionId) {
            session = await this._sessionRepo.findById(sessionId);
            if (!session) throw new NotFoundError('Chat session not found');
            if (session.userId !== userId) throw new ForbiddenError('Forbidden');
        } else {
            session = await this._sessionRepo.create(userId);
            createdNewSession = true;
        }

        await this._messageRepo.save({
            sessionId: session.id,
            role: 'user',
            content: prompt,
        });

        const response = await this._aiService.genarateContent(prompt);

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if(!text) throw new NotFoundError('Ai response was empty');

        await this._messageRepo.save({
            sessionId: session.id,
            role: 'assistant',
            content: text,
        });

        await this._sessionRepo.touch(session.id);

        if (createdNewSession) {
            const oldIds = await this._sessionRepo.listOldSessionIdsByUserId(userId, 10);
            await this._messageRepo.deleteBySessionIds(oldIds);
            await this._sessionRepo.deleteByIds(oldIds);
        }

        return { sessionId: session.id, response: text };
    };
}