import { inject, injectable } from 'tsyringe';

import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import type { IVoteRepository } from '../../../domain/interfaces/IVoteRepository';
import { VoteTargetType } from '../../../domain/types/VoteTargetType';
import { VoteValue } from '../../../domain/types/VoteValue';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { IVoteAnswerUseCase } from '../interface/qna/IVoteAnswerUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

export interface VoteAnswerResult {
  voteCount: number;
  userVote: VoteValue | 0;
}

@injectable()
export class VoteAnswerUseCase implements IVoteAnswerUseCase {
  constructor(
    @inject('IAnswerRepository')
    private readonly _answerRepository: IAnswerRepository,
    @inject('IVoteRepository')
    private readonly _voteRepository: IVoteRepository
  ) {}

  async execute(
    answerId: string,
    userId: string,
    value: VoteValue
  ): Promise<VoteAnswerResult> {
    const answer = await this._answerRepository.find(answerId);

    if (!answer) throw new NotFoundError(ERROR_MESSAGES.QnA.ANSWER_NOT_FOUND);

    const targetType = VoteTargetType.ANSWER;

    const existing = await this._voteRepository.findByUserAndTarget(
      userId,
      answerId,
      targetType
    );

    let delta = 0;
    let userVote: VoteValue | 0 = value;

    if (!existing) {
      await this._voteRepository.create({
        userId,
        targetId: answerId,
        targetType,
        value,
      });
      delta = value;
    } else if (existing.value === value) {
      await this._voteRepository.delete(existing.id);
      delta = -value;
      userVote = 0;
    } else {
      await this._voteRepository.update(existing.id, { value });
      delta = value - existing.value;
    }

    const voteCount = await this._answerRepository.incrementVoteCount(
      answerId,
      delta
    );

    return { voteCount, userVote };
  }
}
