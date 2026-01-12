import { inject, injectable } from 'tsyringe';
import type { IGetBookedSessionsUseCase } from '../interface/session/IGetBookedSessionsUseCase';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IBookedSessionResponseDTO } from '../../dto/SessionDTO';
import { SessionMapper } from '../../mapper/SessionMapper';

@injectable()
export class GetBookedSessionsUseCase implements IGetBookedSessionsUseCase {
    constructor(
        @inject('ISessionRepository') private readonly _sessionRepository: ISessionRepository
    ) { }

    async execute(userId: string): Promise<IBookedSessionResponseDTO[]> {
        const mentorSessions = await this._sessionRepository.findByMentor(userId);
        const menteeSessions = await this._sessionRepository.findByUser(userId);

        const all = [...mentorSessions, ...menteeSessions];
        return all.map(({ session, mentor, user }) =>
            SessionMapper.toBookedResponse(session, mentor, user)
        );
    }
}
