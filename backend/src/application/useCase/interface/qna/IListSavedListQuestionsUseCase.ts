import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity';
import { QuestionListQuery } from '../../../../domain/types/QuestionListQuery';

export interface IListSavedListQuestionsUseCase {
  execute(userId: string, listId: string, query: QuestionListQuery): Promise<PaginationResult<QuestionEntity>>;
}
