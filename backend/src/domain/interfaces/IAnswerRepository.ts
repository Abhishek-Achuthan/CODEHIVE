import { IGenericRepository } from './IGenericRepository';
import { PaginationResult } from '../types/PaginationResult';
import { AnswerEntity } from '../entities/qna/AnswerEntity';
import { IAnswerListQueryDTO } from '../../application/dto/AnswerDTO';

export interface IAnswerRepostiory extends IGenericRepository<AnswerEntity> {
    listByQuestion(data:IAnswerListQueryDTO):Promise<PaginationResult<AnswerEntity>>
    incrementVoteCount(answerId:string,value:number):Promise<number>
    setAccepted(answerId:string):Promise<AnswerEntity | null>
}