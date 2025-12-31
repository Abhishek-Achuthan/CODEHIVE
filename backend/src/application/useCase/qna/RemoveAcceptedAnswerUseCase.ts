import { inject, injectable } from 'tsyringe';

import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';

import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

import type { IRemoveAcceptedAnswerUseCase } from '../interface/qna/IRemoveAcceptedAnswerUseCase';

@injectable()
export class RemoveAcceptedAnswerUseCase implements IRemoveAcceptedAnswerUseCase {
  constructor(
    @inject('IAnswerRepository')
    private readonly _answerRepository: IAnswerRepository,
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository
  ) {}

  async execute(userId: string, questionId: string): Promise<void> {
    const question = await this._questionRepository.find(questionId);

    if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

    if (question.askedBy !== userId)
      throw new ForbiddenError(ERROR_MESSAGES.QnA.NOT_ALLOWED_TO_EDIT_QUESTION);

    if (!question.acceptedAnswerId) return;

    await Promise.all([
      this._answerRepository.update(question.acceptedAnswerId, {
        isAccepted: false,
      }),
      this._questionRepository.update(questionId, {
        acceptedAnswerId: null,
        isAnswered: question.answerCount > 0,
      }),
    ]);
  }
}
