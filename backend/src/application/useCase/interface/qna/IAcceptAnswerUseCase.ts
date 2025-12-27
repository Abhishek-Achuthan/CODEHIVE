import { IAcceptAnswerInputDTO, IAnswerResponseDTO } from '../../../dto/AnswerDTO';

export interface IAcceptAnswerUseCase {
    execute(data:IAcceptAnswerInputDTO) :Promise<IAnswerResponseDTO | null>;
}