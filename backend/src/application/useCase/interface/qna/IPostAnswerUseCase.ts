import { AnswerEntity } from '../../../../domain/entities/qna/AnswerEntity';
import { ICreateAnswerInputDTO } from '../../../dto/AnswerDTO';

export interface IPostAnswerUseCase {
    execute(data:ICreateAnswerInputDTO) : Promise<AnswerEntity>
}