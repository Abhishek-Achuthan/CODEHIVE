import { inject, injectable } from 'tsyringe';

import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import type { IVoteRepository } from '../../../domain/interfaces/IVoteRepository';
import { VoteTargetType } from '../../../domain/types/VoteTargetType';
import { VoteValue } from '../../../domain/types/VoteValue';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { IVoteQuestionUseCase } from '../interface/qna/IVoteQuestionUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

export interface VoteQuestionResult {
  votes: number;
  userVote: VoteValue | 0;
}

@injectable()
export class VoteQuestionUseCase implements IVoteQuestionUseCase {
  constructor(
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository,
    @inject('IVoteRepository')
    private readonly _voteRepository: IVoteRepository
  ) {}

  async execute(
    questionId: string,
    userId: string,
    value: VoteValue
  ): Promise<VoteQuestionResult> {
    const question = await this._questionRepository.find(questionId);

    if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

    const targetType = VoteTargetType.QUESTION;

    const existing = await this._voteRepository.findByUserAndTarget(
      userId,
      questionId,
      targetType
    );

    let voteChange = 0;
    let userVote: VoteValue | 0 = value;

    if (!existing) {
      await this._voteRepository.create({
        userId,
        targetId: questionId,
        targetType,
        value,
      });
      voteChange = value;
    } else if (existing.value === value) {
      await this._voteRepository.delete(existing.id);
      voteChange = -value;
      userVote = 0;
    } else {
      await this._voteRepository.update(existing.id, { value });
      voteChange = value - existing.value;
    }

    const votes = await this._questionRepository.incrementVotes(questionId, voteChange);

    return { votes, userVote };
  }
}
