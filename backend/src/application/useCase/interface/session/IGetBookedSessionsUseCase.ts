import { IBookedSessionResponseDTO, SessionPerspective } from '../../../dto/SessionDTO';

export interface IGetBookedSessionsUseCase {
    execute(userId: string, perspective: SessionPerspective): Promise<IBookedSessionResponseDTO[]>;
}
