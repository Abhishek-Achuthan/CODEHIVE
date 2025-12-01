import { inject,injectable } from 'tsyringe';
import { IListAnswerUseCase } from '../interface/qna/IListAnswerUseCase';
import type { IAnswerRepostiory } from '../../../domain/interfaces/IAnswerRepository';
import { AnswerEntity } from '../../../domain/entities/qna/AnswerEntity';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { IAnswerListQueryDTO } from '../../dto/AnswerDTO';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { NotFoundError } from '../../../core/errors/NotFoundError';

@injectable()
export class ListAnswerUseCase implements IListAnswerUseCase {
    
    constructor(
        @inject('IAnswerRepository') private readonly _answerRepository : IAnswerRepostiory,
        @inject('IQuestionRepository') private readonly _questionRepository : IQuestionRepository
    ){}

    async execute(data: IAnswerListQueryDTO): Promise<PaginationResult<AnswerEntity>> {
        
        const question = await this._questionRepository.find(data.questionId);

        if(!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

        return await this._answerRepository.listByQuestion(data);
    }
}