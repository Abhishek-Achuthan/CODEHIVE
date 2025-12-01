import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity';

export interface IGetQuestionUseCase {
    execute(questionId: string): Promise<QuestionEntity>
}