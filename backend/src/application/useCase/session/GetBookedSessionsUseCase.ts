import { inject, injectable } from 'tsyringe';
import type { IGetBookedSessionsUseCase } from '../interface/session/IGetBookedSessionsUseCase';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { SessionEntity } from '../../../domain/session/SessionEntity';

@injectable()
export class GetBookedSessionsUseCase implements IGetBookedSessionsUseCase {
    constructor(
        @inject('ISessionRepository') private readonly _sessionRepository: ISessionRepository
    ) { }

    async execute(userId: string): Promise<SessionEntity[]> {
        const mentorSessions = await this._sessionRepository.findByMentor(userId);
        const menteeSessions = await this._sessionRepository.findByUser(userId);

        return [...mentorSessions, ...menteeSessions];
    }
}
