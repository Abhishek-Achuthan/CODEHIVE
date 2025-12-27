import { inject,injectable } from 'tsyringe';
import { IGetAnswerUseCase } from '../interface/qna/IGetAnswerUseCase';
import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { IGetAnswerResponseDTO } from '../../dto/AnswerDTO';
import { AnswerMapper } from '../../mapper/AnswerMapper';

@injectable()
export class GetAnswerUseCase implements IGetAnswerUseCase {

    constructor(
        @inject('IAnswerRepository') private readonly _answerRepository: IAnswerRepository
    ){}

    async execute(answerId: string): Promise<IGetAnswerResponseDTO> {
        const answer = await this._answerRepository.find(answerId);

        if(!answer) throw new NotFoundError(ERROR_MESSAGES.QnA.ANSWER_NOT_FOUND);

        return AnswerMapper.toGetAnswerResponse(answer);
    }
}