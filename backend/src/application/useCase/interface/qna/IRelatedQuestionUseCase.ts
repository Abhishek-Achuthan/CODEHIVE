import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity';

export interface IRelatedQuestionUseCase {
    execute(questionId:string):Promise<QuestionEntity[]>
} 