import { inject, injectable } from 'tsyringe';
import { IListUserQuestionsUseCase, ListUserQuestionsQuery } from '../interface/qna/IListUserQuestionsUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { QuestionListQuery } from '../../../domain/types/QuestionListQuery';

@injectable()
export class ListUserQuestionsUseCase implements IListUserQuestionsUseCase {
    constructor(
        @inject('IQuestionRepository') private readonly _questionRepository: IQuestionRepository
    ) { }

    async execute(
        userId: string,
        query: ListUserQuestionsQuery = {}
    ): Promise<PaginationResult<QuestionEntity>> {
        const { page = 1, limit = 10, sortBy, search } = query;

        const listQuery: QuestionListQuery = {
            page,
            limit,
            ...(sortBy && { sortBy }),
            ...(search && { search }), 
            filter: {
                askedBy: userId
            }
        };

        return this._questionRepository.list(listQuery);
    }
}