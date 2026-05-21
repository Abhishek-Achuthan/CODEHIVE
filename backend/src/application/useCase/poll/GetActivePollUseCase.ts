import { inject,injectable } from 'tsyringe';
import {
  GetActivePollDTO,
  IGetActivePollUseCase,
} from '../interface/poll/IGetActivePollUseCase';
import type { IPollRepository } from '../../../domain/interfaces/IPollRepository';
import { PollEntity } from '../../../domain/entities/room/PollEntity';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';



@injectable()
export class GetActivePollUseCase implements IGetActivePollUseCase {
    constructor(
        @inject('IPollRepository') private readonly _pollRepo: IPollRepository,
        @inject(RoomAuthorizationService)
        private readonly _roomAuthorizationService: RoomAuthorizationService,
    ){}

    async execute(data: GetActivePollDTO): Promise<PollEntity | null> {
        await this._roomAuthorizationService.assertAnyCapability(
            data.roomId,
            data.userId,
            [
                CapabilityKey.ROOM_POLLS_CREATE,
                CapabilityKey.ROOM_POLLS_VOTE,
                CapabilityKey.ROOM_POLLS_CLOSE,
            ],
            'read',
        );

        const activePoll = await this._pollRepo.findActivePollByRoomId(data.roomId);

        return activePoll;
    }
}
