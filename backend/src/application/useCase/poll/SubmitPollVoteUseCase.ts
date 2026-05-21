import { inject, injectable } from 'tsyringe';

import type { ICreatePollOutputDTO } from '../../dto/PollDTO';
import type { IPollRepository } from '../../../domain/interfaces/IPollRepository';
import type {
  ISubmitPollVoteUseCase,
  SubmitPollVoteInputDTO,
} from '../interface/poll/ISubmitPollVoteUseCase';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';

@injectable()
export class SubmitPollVoteUseCase implements ISubmitPollVoteUseCase {
  constructor(
    @inject('IPollRepository')
    private readonly _pollRepository: IPollRepository,
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: SubmitPollVoteInputDTO): Promise<ICreatePollOutputDTO> {
    const poll = await this._pollRepository.find(data.pollId);
    if (!poll) {
      throw new NotFoundError(ERROR_MESSAGES.POLL.POLL_NOT_FOUND);
    }

    if (!poll.isActive) {
      throw new BadRequestError(ERROR_MESSAGES.POLL.POLL_CLOSED)
    }

    if (poll.expiresAt && poll.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestError(ERROR_MESSAGES.POLL.POLL_EXPIRED);
    }

    await this._roomAuthorizationService.assertCapability(
      poll.roomId,
      data.userId,
      CapabilityKey.ROOM_POLLS_VOTE,
    );

    if (!poll.allowMultiple && data.optionIds.length > 1) {
      throw new BadRequestError(ERROR_MESSAGES.POLL.POLL_ONE_OPTION);
    }

    const optionIds = new Set(poll.options.map((option) => option.id));
    const hasUnknownOption = data.optionIds.some((optionId) => !optionIds.has(optionId));
    if (hasUnknownOption) {
      throw new BadRequestError(ERROR_MESSAGES.POLL.INVALID_POLL_OPTION);
    }

    return this._pollRepository.submitVote(data);
  }
}
