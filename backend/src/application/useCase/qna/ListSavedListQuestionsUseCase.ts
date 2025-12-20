import { inject, injectable } from 'tsyringe';
import type { IListSavedListQuestionsUseCase } from '../interface/qna/IListSavedListQuestionsUseCase';
import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import type { ISavedListItemRepository } from '../../../domain/interfaces/ISavedListItemRepository';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { QuestionListQuery } from '../../../domain/types/QuestionListQuery';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';

@injectable()
export class ListSavedListQuestionsUseCase implements IListSavedListQuestionsUseCase {
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository,
    @inject('ISavedListItemRepository')
    private readonly _savedListItemRepository: ISavedListItemRepository,
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository
  ) {}

  async execute(
    userId: string,
    listId: string,
    query: QuestionListQuery
  ): Promise<PaginationResult<QuestionEntity>> {
    const list = await this._savedListRepository.find(listId);

    if (!list || list.userId !== userId) throw new NotFoundError('List not found');

    const questionIds = await this._savedListItemRepository.findQuestionIdsByList(listId);

    return this._questionRepository.listByIds(questionIds, query);
  }
}
