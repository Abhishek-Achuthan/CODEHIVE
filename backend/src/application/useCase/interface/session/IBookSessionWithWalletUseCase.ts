import { BookSessionDTO, ISessionResponseDTO } from '../../../dto/SessionDTO';

export interface IBookSessionWithWalletUseCase {
  execute(input: BookSessionDTO): Promise<ISessionResponseDTO>;
}
