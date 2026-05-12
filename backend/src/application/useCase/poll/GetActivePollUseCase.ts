import { inject,injectable } from 'tsyringe';
import { IGetActivePollUseCase } from '../interface/poll/IGetActivePollUseCase';
import type { IPollRepository } from '../../../domain/interfaces/IPollRepository';
import { PollEntity } from '../../../domain/entities/room/PollEntity';



@injectable()
export class GetActivePollUseCase implements IGetActivePollUseCase {
    constructor(
        @inject('IPollRepository') private readonly _pollRepo: IPollRepository
    ){}

    async execute(roomId: string): Promise<PollEntity | null> {
        const activePoll = await this._pollRepo.findActivePollByRoomId(roomId);

        return activePoll;
    }
}
