import { IGetAnswerResponseDTO } from '../../../dto/AnswerDTO';

export interface IGetAnswerUseCase {
    execute(answerId:string):Promise<IGetAnswerResponseDTO>;
}