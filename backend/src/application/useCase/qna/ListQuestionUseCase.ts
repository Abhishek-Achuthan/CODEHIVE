import { inject,injectable } from 'tsyringe';
import { IListQuestionUseCase } from '../interface/qna/IListQuestionsUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { IQuestionListQueryDTO } from '../../dto/QuestionDTO';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';


@injectable()
export class ListQuestionUseCase implements IListQuestionUseCase {
    constructor(
        @inject('IQuestionRepository') private readonly _questionRepository:IQuestionRepository
    ){}

    async execute(data: IQuestionListQueryDTO): Promise<PaginationResult<QuestionEntity>> {
        return await this._questionRepository.list(data);
    }

}