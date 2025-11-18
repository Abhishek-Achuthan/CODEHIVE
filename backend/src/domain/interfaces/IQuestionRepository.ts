import { IQuestionListQueryDTO } from '../../application/dto/QuestionDTO';
import { QuestionEntity } from '../entities/qna/QuestionEntity';
import { PaginationResult } from '../types/PaginationResult';
import { IGenericRepository } from './IGenericRepository';

export interface IQuestionRepository extends IGenericRepository<QuestionEntity> {
    findByAuthorId(authorId:string): Promise<PaginationResult<QuestionEntity>>;
    list(data:IQuestionListQueryDTO):Promise<PaginationResult<QuestionEntity>>
}