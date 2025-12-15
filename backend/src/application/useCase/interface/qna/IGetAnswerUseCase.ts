import { AnswerEntity } from '../../../../domain/entities/qna/AnswerEntity';

export interface IGetAnswerUseCase {
    execute(answerId:string):Promise<AnswerEntity>;
}