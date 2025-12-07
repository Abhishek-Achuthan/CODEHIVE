import { QuestionWithAuthorDTO } from '../../../dto/QuestionDTO';

export interface IGetQuestionUseCase {
    execute(questionId: string,userId:string): Promise<QuestionWithAuthorDTO>
}