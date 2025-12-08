import { AnswerWithAuthor } from '../../../../domain/types/AnswerWithAuthor';
import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { IAnswerListQueryDTO } from '../../../dto/AnswerDTO';

export interface IListAnswerUseCase {
    execute(data:IAnswerListQueryDTO):Promise<PaginationResult<AnswerWithAuthor>>
}