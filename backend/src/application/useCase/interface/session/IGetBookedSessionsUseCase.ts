import { IBookedSessionResponseDTO, SessionListInputDTO } from '../../../dto/SessionDTO';

import { PaginationResult } from '../../../../domain/types/PaginationResult';

export interface IGetBookedSessionsUseCase {
    execute(userId: string, input: SessionListInputDTO): Promise<PaginationResult<IBookedSessionResponseDTO>>;
}
