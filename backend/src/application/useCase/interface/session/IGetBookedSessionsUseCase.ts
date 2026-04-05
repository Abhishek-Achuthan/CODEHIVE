import { IBookedSessionResponseDTO, SessionListInputDTO } from '../../../dto/SessionDTO';

export interface IGetBookedSessionsUseCase {
    execute(userId: string, input: SessionListInputDTO): Promise<IBookedSessionResponseDTO[]>;
}
