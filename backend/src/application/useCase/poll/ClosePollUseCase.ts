import { inject, injectable } from 'tsyringe';
import { IClosePollUseCase } from '../interface/poll/IClosePollUseCase';
import type { IPollRepository } from '../../../domain/interfaces/IPollRepository';
import { PollEntity } from '../../../domain/entities/room/PollEntity';
import { IClosePollInputDTO } from '../../dto/PollDTO';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';

@injectable()
export class ClosePollUseCase implements IClosePollUseCase {
  constructor(
    @inject('IPollRepository') private readonly pollRepo: IPollRepository,
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: IClosePollInputDTO): Promise<PollEntity | null> {
    const user = await this.userRepo.find(data.userId);

    if (!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

    const poll = await this.pollRepo.findActivePollByRoomId(data.roomId);

    if (!poll) throw new NotFoundError(ERROR_MESSAGES.POLL.POLL_NOT_FOUND);

    if(poll.id !== data.pollId) throw new NotFoundError(ERROR_MESSAGES.POLL.POLL_NOT_FOUND);

    await this.roomAuthorizationService.assertCapability(
      poll.roomId,
      data.userId,
      CapabilityKey.ROOM_POLLS_CLOSE,
    );

    const closedPoll = await this.pollRepo.closePoll(data.pollId);

    return closedPoll;
  }
}
