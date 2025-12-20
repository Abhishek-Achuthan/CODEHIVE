import { IGenericRepository } from './IGenericRepository';
import { PaginationResult } from '../types/PaginationResult';
import { AnswerEntity } from '../entities/qna/AnswerEntity';
import { AnswerWithAuthor } from '../types/AnswerWithAuthor';
import { AnswerListQuery } from '../types/AnswerListQuery';
import { AnswerEditableFields } from '../types/AnswerEditableFields';

export interface IAnswerRepository extends IGenericRepository<AnswerEntity> {
    setAccepted(answerId:string):Promise<AnswerEntity | null>;
    listByQuestion(questionId:string,queryType:AnswerListQuery):Promise<PaginationResult<AnswerWithAuthor>>;
    updateWithVersion(answerId:string,expectedVersion:number,payload:AnswerEditableFields):Promise<AnswerEntity | null>;
    findAnsweredQuestionIdsByUser(userId:string):Promise<string[]>;
    incrementVoteCount(answerId: string, delta: number): Promise<number>;
    findIdsByQuestion(questionId: string): Promise<string[]>;
    deleteByQuestion(questionId: string): Promise<void>;
}