import { SavedQuestionEntity } from '../entities/qna/SavedQuestionEntity';
import { IGenericRepository } from './IGenericRepository';


export interface ISavedQuestionRepository extends IGenericRepository<SavedQuestionEntity> {
}