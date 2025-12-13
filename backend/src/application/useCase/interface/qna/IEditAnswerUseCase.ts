import { AnswerEntity } from '../../../../domain/entities/qna/AnswerEntity';
import { IEditAnswerInputDTO } from '../../../dto/AnswerDTO';

export interface IEditAnswerUseCase {
    execute(data:IEditAnswerInputDTO):Promise<AnswerEntity | null>
}