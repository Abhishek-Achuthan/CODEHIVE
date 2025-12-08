import { IGenericRepository } from './IGenericRepository';
import { PaginationResult } from '../types/PaginationResult';
import { AnswerEntity } from '../entities/qna/AnswerEntity';
import { AnswerWithAuthor } from '../types/AnswerWithAuthor';
import { AnswerListQuery } from '../types/AnswerListQuery';

export interface IAnswerRepostiory extends IGenericRepository<AnswerEntity> {
    setAccepted(answerId:string):Promise<AnswerEntity | null>;
    listByQuestion(questionId:string,queryType:AnswerListQuery):Promise<PaginationResult<AnswerWithAuthor>>;
}