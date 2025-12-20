import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity';
import { QuestionListQuery } from '../../../../domain/types/QuestionListQuery';

export interface IListSavedQuestionsUseCase {
  execute(userId: string, query: QuestionListQuery): Promise<PaginationResult<QuestionEntity>>;
}
