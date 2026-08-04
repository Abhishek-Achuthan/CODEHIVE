import type { IClosePollInputDTO } from '../../../dto/PollDTO';
import type { PollEntity } from '../../../../domain/entities/room/PollEntity';

export interface IClosePollUseCase {
  execute(data: IClosePollInputDTO): Promise<PollEntity | null>;
}