import { PollEntity } from '../../../../domain/entities/room/PollEntity';

export interface GetActivePollDTO {
  roomId: string;
  userId: string;
}

export interface IGetActivePollUseCase {
    execute(data: GetActivePollDTO): Promise<PollEntity | null>
}
