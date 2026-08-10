import { inject, injectable } from 'tsyringe';
import { IGetClosePollUseCase } from '../interface/poll/IGetClosePollUseCase';
import { type IPollRepository } from '../../../domain/interfaces/IPollRepository';
import { type IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { PollEntity } from '../../../domain/entities/room/PollEntity';

@injectable()
export class GetClosePollUseCase implements IGetClosePollUseCase {
    constructor(
        @inject('IPollRepository') private readonly _pollRepository: IPollRepository,
        @inject('IRoomRepository') private readonly _roomRepository: IRoomRepository
    ) {}

    async execute(roomId: string): Promise<PollEntity[]> {
        const room = await this._roomRepository.find(roomId);

        if (!room) throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);

        const closedPolls = await this._pollRepository.findClosedPollsByRoomId(roomId,false);

        return closedPolls;
    }
}