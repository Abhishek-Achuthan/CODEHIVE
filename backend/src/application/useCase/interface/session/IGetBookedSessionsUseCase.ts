import { IBookedSessionResponseDTO } from '../../../dto/SessionDTO';

export interface IGetBookedSessionsUseCase {
    execute(userId: string): Promise<IBookedSessionResponseDTO[]>;
}
