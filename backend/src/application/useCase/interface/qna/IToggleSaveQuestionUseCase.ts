import { ToggleSavedQuestionResult } from '../../../dto/QuestionDTO';

export interface IToggleSaveQuestionUseCase {
    execute(questionId:string,userId:string):Promise<ToggleSavedQuestionResult>
}

