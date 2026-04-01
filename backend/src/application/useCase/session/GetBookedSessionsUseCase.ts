import { inject, injectable } from 'tsyringe';
import type { IGetBookedSessionsUseCase } from '../interface/session/IGetBookedSessionsUseCase';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IBookedSessionResponseDTO, SessionPerspective } from '../../dto/SessionDTO';
import { SessionMapper } from '../../mapper/SessionMapper';

@injectable()
export class GetBookedSessionsUseCase implements IGetBookedSessionsUseCase {
    constructor(
        @inject('ISessionRepository') private readonly _sessionRepository: ISessionRepository
    ) { }

    async execute(userId: string, perspective: SessionPerspective): Promise<IBookedSessionResponseDTO[]> {
        const sessions = perspective === 'mentor'
            ? await this._sessionRepository.findByMentor(userId)
            : await this._sessionRepository.findByUser(userId);

        return sessions.map(({ session, mentor, user }) =>
            SessionMapper.toBookedResponse(session, mentor, user)
        );
    }
}
