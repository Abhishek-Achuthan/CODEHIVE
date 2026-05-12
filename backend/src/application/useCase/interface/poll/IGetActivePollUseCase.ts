import { PollEntity } from '../../../../domain/entities/room/PollEntity';

export interface IGetActivePollUseCase {
    execute(roomId: string): Promise<PollEntity | null>
}
