import { inject, injectable } from 'tsyringe';
import { IToggleSaveQuestionUseCase } from '../interface/qna/IToggleSaveQuestionUseCase';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import type { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import { ToggleSavedQuestionResult } from '../../dto/QuestionDTO';

@injectable()
export class ToggleSaveQuestionUseCase implements IToggleSaveQuestionUseCase {
  constructor(
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository,
    @inject('ISavedQuestionRepository')
    private readonly _savedQuestionRepository: ISavedQuestionRepository
  ) {}

  async execute(
    questionId: string,
    userId: string
  ): Promise<ToggleSavedQuestionResult> {
    const question = await this._questionRepository.find(questionId);

    if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

    const existing = await this._savedQuestionRepository.findByUserAndQuestion(
      userId,
      questionId
    );

    if (existing) {
      await this._savedQuestionRepository.delete(existing.id);

      return {
        isBookmarked: false,
      };
    }

    await this._savedQuestionRepository.create({
      questionId,
      userId,
    });

    return {
      isBookmarked: true,
    };
  }
}
