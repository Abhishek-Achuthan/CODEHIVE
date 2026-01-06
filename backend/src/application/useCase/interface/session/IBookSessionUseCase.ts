import { BookSessionDTO, ISessionResponseDTO } from '../../../dto/SessionDTO';

export interface IBookSessionUseCase {
    execute(input:BookSessionDTO):Promise<ISessionResponseDTO>
}