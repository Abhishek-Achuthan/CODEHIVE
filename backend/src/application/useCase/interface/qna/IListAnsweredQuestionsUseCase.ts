import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity';
import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { QuestionListQuery } from '../../../../domain/types/QuestionListQuery';

export interface IListAnsweredQuestionUseCase {
    execute(userId:string,data:QuestionListQuery) : Promise<PaginationResult<QuestionEntity>>
}