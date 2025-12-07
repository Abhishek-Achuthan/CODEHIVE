import { SavedQuestionEntity } from '../entities/qna/SavedQuestionEntity';
import { IGenericRepository } from './IGenericRepository';


export interface ISavedQuestionRepository extends IGenericRepository<SavedQuestionEntity> {

    findByUserAndQuestion(userId:string,questionId:string):Promise<SavedQuestionEntity | null>
}