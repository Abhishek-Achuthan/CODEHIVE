import { IAnswerResponseDTO, ICreateAnswerInputDTO } from '../../../dto/AnswerDTO';

export interface IPostAnswerUseCase {
    execute(data:ICreateAnswerInputDTO) : Promise<IAnswerResponseDTO>
}