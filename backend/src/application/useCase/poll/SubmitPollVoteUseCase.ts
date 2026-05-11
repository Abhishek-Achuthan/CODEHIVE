import { inject, injectable } from 'tsyringe';

import type { ICreatePollOutputDTO } from '../../dto/PollDTO';
import type { IPollRepository } from '../../../domain/interfaces/IPollRepository';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import type {
  ISubmitPollVoteUseCase,
  SubmitPollVoteInputDTO,
} from '../interface/poll/ISubmitPollVoteUseCase';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class SubmitPollVoteUseCase implements ISubmitPollVoteUseCase {
  constructor(
    @inject('IPollRepository')
    private readonly _pollRepository: IPollRepository,
    @inject('IParticipantRepository')
    private readonly _participantRepository: IParticipantRepository,
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

    const participant = await this._participantRepository.findByRoomAndUser(
      poll.roomId,
      data.userId,
    );
    if (!participant) {
      throw new BadRequestError(ERROR_MESSAGES.ROOM.USER_NOT_IN_ROOM);
    }

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
