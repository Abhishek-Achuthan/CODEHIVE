import { inject, injectable } from 'tsyringe';
import type { IGetBookedSessionsUseCase } from '../interface/session/IGetBookedSessionsUseCase';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IBookedSessionResponseDTO, SessionListInputDTO } from '../../dto/SessionDTO';
import { SessionMapper } from '../../mapper/SessionMapper';

@injectable()
export class GetBookedSessionsUseCase implements IGetBookedSessionsUseCase {
    constructor(
        @inject('ISessionRepository') private readonly _sessionRepository: ISessionRepository
    ) { }

    async execute(userId: string, input: SessionListInputDTO): Promise<IBookedSessionResponseDTO[]> {
        const sessions = await this._sessionRepository.listByParticipant(userId, {
            ...(input.role !== undefined && { role: input.role }),
            ...(input.page !== undefined && { page: input.page }),
            ...(input.limit !== undefined && { limit: input.limit }),
            filter: {
                ...(input.filter?.status !== undefined && { status: input.filter.status }),
                ...(input.filter?.dateFrom !== undefined && { dateFrom: input.filter.dateFrom }),
                ...(input.filter?.dateTo !== undefined && { dateTo: input.filter.dateTo }),
                ...(input.filter?.paymentSource !== undefined && { paymentSource: input.filter.paymentSource }),
                ...(input.filter?.refundableNow !== undefined && { refundableNow: input.filter.refundableNow }),
            },
        });

        return sessions.map(({ session, mentor, user }) =>
            SessionMapper.toBookedResponse(session, mentor, user)
        );
    }
}
