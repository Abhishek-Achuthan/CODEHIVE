import { SavedQuestionEntity } from '../../../../domain/entities/qna/SavedQuestionEntity';

export interface ISaveQuestionUseCase {
    execute(questionId:string,userId:string):Promise<SavedQuestionEntity>
}