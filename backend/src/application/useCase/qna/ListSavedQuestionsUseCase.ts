import { inject, injectable } from 'tsyringe';
import type { IListSavedQuestionsUseCase } from '../interface/qna/IListSavedQuestionsUseCase';
import type { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { QuestionListQuery } from '../../../domain/types/QuestionListQuery';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';

@injectable()
export class ListSavedQuestionsUseCase implements IListSavedQuestionsUseCase {
  constructor(
    @inject('ISavedQuestionRepository')
    private readonly _savedQuestionRepository: ISavedQuestionRepository,
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository
  ) {}

  async execute(
    userId: string,
    query: QuestionListQuery
  ): Promise<PaginationResult<QuestionEntity>> {
    const questionIds = await this._savedQuestionRepository.findQuestionIdsByUser(userId);
    return this._questionRepository.listByIds(questionIds, query);
  }
}
