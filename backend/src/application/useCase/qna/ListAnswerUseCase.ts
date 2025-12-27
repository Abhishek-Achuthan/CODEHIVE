import { inject,injectable } from 'tsyringe';
import { IListAnswerUseCase } from '../interface/qna/IListAnswerUseCase';
import { type IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { AnswerWithAuthorDTO, IAnswerListQueryDTO } from '../../dto/AnswerDTO';
import { type IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { AnswerListQuery } from '../../../domain/types/AnswerListQuery';
import { AnswerMapper } from '../../mapper/AnswerMapper';

@injectable()
export class ListAnswerUseCase implements IListAnswerUseCase {
    
    constructor(
        @inject('IAnswerRepository') private readonly _answerRepository : IAnswerRepository,
        @inject('IQuestionRepository') private readonly _questionRepository : IQuestionRepository
    ){}

    async execute(data: IAnswerListQueryDTO): Promise<PaginationResult<AnswerWithAuthorDTO>> {

        const {questionId,page,limit,sortBy,search} = data;
        
        const question = await this._questionRepository.find(data.questionId);

        if(!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

        const query : AnswerListQuery = {};

        if (page !== undefined) query.page = page;
        
        if(limit !== undefined) query.limit = limit;

        if(sortBy !== undefined) query.sortBy = sortBy;

        if(search !== undefined) query.search = search;

        const result = await this._answerRepository.listByQuestion(questionId,query);

        return {
            items: result.items.map((i) => AnswerMapper.toAnswerWithAuthor(i)),
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        };
        
    }
}