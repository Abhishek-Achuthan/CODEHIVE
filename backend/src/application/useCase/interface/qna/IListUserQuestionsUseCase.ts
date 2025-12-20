import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity';
import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { QuestionSort } from '../../../../domain/types/QuestionSort';

export interface ListUserQuestionsQuery {
    page?: number;
    limit?: number;
    sortBy?: QuestionSort;
    search?:string;
}

export interface IListUserQuestionsUseCase {
    execute(userId: string, query?: ListUserQuestionsQuery): Promise<PaginationResult<QuestionEntity>>;
}