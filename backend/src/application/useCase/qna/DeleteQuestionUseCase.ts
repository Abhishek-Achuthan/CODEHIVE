import { inject, injectable } from 'tsyringe';

import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import type { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import type { ISavedListItemRepository } from '../../../domain/interfaces/ISavedListItemRepository';
import type { IVoteRepository } from '../../../domain/interfaces/IVoteRepository';
import { VoteTargetType } from '../../../domain/types/VoteTargetType';

import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

import type { IDeleteQuestionUseCase } from '../interface/qna/IDeleteQuestionUseCase';

@injectable()
export class DeleteQuestionUseCase implements IDeleteQuestionUseCase {
  constructor(
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository,
    @inject('IAnswerRepository')
    private readonly _answerRepository: IAnswerRepository,
    @inject('ISavedQuestionRepository')
    private readonly _savedQuestionRepository: ISavedQuestionRepository,
    @inject('ISavedListItemRepository')
    private readonly _savedListItemRepository: ISavedListItemRepository,
    @inject('IVoteRepository')
    private readonly _voteRepository: IVoteRepository
  ) {}

  async execute(userId: string, questionId: string): Promise<void> {
    const question = await this._questionRepository.find(questionId);

    if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

    if (question.askedBy !== userId)
       throw new ForbiddenError(ERROR_MESSAGES.QnA.NOT_ALLOWED_TO_EDIT_QUESTION);

    const answerIds = await this._answerRepository.findIdsByQuestion(questionId);

    await Promise.all([
      this._voteRepository.deleteByTarget(questionId, VoteTargetType.QUESTION),
      this._voteRepository.deleteByTargetIds(answerIds, VoteTargetType.ANSWER),
      this._answerRepository.deleteByQuestion(questionId),
      this._savedQuestionRepository.deleteByQuestion(questionId),
      this._savedListItemRepository.deleteByQuestion(questionId),
    ]);

    await this._questionRepository.delete(questionId);
  }
}
