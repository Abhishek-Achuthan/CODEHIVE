import { AnswerEntity } from '../../../../domain/entities/qna/AnswerEntity';
import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { IAnswerListQueryDTO } from '../../../dto/AnswerDTO';

export interface IListAnswerUseCase {
    execute(data:IAnswerListQueryDTO):Promise<PaginationResult<AnswerEntity>>
}