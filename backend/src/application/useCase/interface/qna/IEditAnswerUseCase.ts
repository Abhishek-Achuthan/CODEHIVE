import { IAnswerResponseDTO, IEditAnswerInputDTO } from '../../../dto/AnswerDTO';

export interface IEditAnswerUseCase {
    execute(data:IEditAnswerInputDTO):Promise<IAnswerResponseDTO | null>
}