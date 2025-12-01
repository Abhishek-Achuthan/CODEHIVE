import { inject,injectable } from 'tsyringe';
import { IGetQuestionUseCase } from '../interface/qna/IGetQuestionUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';
import { NotFoundError } from '../../../core/errors/NotFoundError';


@injectable()
export class GetQuestionUseCase implements IGetQuestionUseCase {
    constructor(
        @inject('IQuestionRepository') private readonly _questionRepository : IQuestionRepository,
    ) {}

    async execute(questionId: string ): Promise<QuestionEntity> {
        
        const question = await this._questionRepository.find(questionId);

        if(!question) throw new NotFoundError('Question not found');

        return question;
    }
}