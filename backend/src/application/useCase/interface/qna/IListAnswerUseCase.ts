import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { AnswerWithAuthorDTO, IAnswerListQueryDTO } from '../../../dto/AnswerDTO';

export interface IListAnswerUseCase {
    execute(data:IAnswerListQueryDTO):Promise<PaginationResult<AnswerWithAuthorDTO>>
}