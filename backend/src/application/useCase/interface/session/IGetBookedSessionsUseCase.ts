import { SessionEntity } from '../../../../domain/session/SessionEntity';

export interface IGetBookedSessionsUseCase {
    execute(userId: string): Promise<SessionEntity[]>;
}
