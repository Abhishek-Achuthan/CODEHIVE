import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity'
import { PaginationResult } from '../../../../domain/types/PaginationResult'
import { IQuestionListQueryDTO } from '../../../dto/QuestionDTO'

export interface IListQuestionUseCase {
    execute(data:IQuestionListQueryDTO):Promise<PaginationResult<QuestionEntity>>
}