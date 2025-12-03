import { IQuestionListQueryDTO } from '../../application/dto/QuestionDTO';
import { QuestionEntity } from '../entities/qna/QuestionEntity';
import { PaginationResult } from '../types/PaginationResult';
import { IGenericRepository } from './IGenericRepository';

export interface IQuestionRepository extends IGenericRepository<QuestionEntity> {
    findByAuthorId(authorId:string): Promise<PaginationResult<QuestionEntity>>;
    list(data:IQuestionListQueryDTO):Promise<PaginationResult<QuestionEntity>>;
    incrementAnswerCount(questionId:string,amount:number):Promise<void>;
    setIsAnswered(questionId:string,isAnswered:boolean):Promise<void>;
    incrementAnswerCountAndSetAnswered(questionId:string,amount:number,setAnswered:boolean):Promise<void>
    getQuestionById(questionId:string):Promise<QuestionEntity | null>,
    relatedQuestions(questionId:string):Promise<QuestionEntity[]>
}