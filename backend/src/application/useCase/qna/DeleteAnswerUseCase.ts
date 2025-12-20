import { inject, injectable } from 'tsyringe';

import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import type { IVoteRepository } from '../../../domain/interfaces/IVoteRepository';
import { VoteTargetType } from '../../../domain/types/VoteTargetType';

import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

import type { IDeleteAnswerUseCase } from '../interface/qna/IDeleteAnswerUseCase';

@injectable()
export class DeleteAnswerUseCase implements IDeleteAnswerUseCase {
  constructor(
    @inject('IAnswerRepository')
    private readonly _answerRepository: IAnswerRepository,
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository,
    @inject('IVoteRepository')
    private readonly _voteRepository: IVoteRepository
  ) {}

  async execute(userId: string, answerId: string): Promise<void> {
    const answer = await this._answerRepository.find(answerId);

    if (!answer) throw new NotFoundError(ERROR_MESSAGES.QnA.ANSWER_NOT_FOUND);

    if (answer.answeredBy !== userId)
      throw new ForbiddenError(ERROR_MESSAGES.QnA.NOT_ALLOWED_TO_EDIT_ANSWER);

    const question = await this._questionRepository.find(answer.questionId);

    if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

    await Promise.all([
      this._voteRepository.deleteByTarget(answerId, VoteTargetType.ANSWER),
      this._answerRepository.delete(answerId),
      this._questionRepository.incrementAnswerCount(answer.questionId, -1),
    ]);

    const newCount = Math.max(0, question.answerCount - 1);

    if (question.acceptedAnswerId === answerId) {
      await this._questionRepository.update(answer.questionId, {
        acceptedAnswerId: null,
        isAnswered: newCount > 0,
      });
    } else if (newCount === 0) {
      await this._questionRepository.setIsAnswered(answer.questionId, false);
    }
  }
}
