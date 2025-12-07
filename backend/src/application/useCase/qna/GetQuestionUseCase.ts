import { inject,injectable } from 'tsyringe';
import { IGetQuestionUseCase } from '../interface/qna/IGetQuestionUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { QuestionWithAuthorDTO } from '../../dto/QuestionDTO';
import type { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import { QuestionMapper } from '../../mapper/QuestionMapper';


@injectable()
export class GetQuestionUseCase implements IGetQuestionUseCase {
    constructor(
        @inject('IQuestionRepository') private readonly _questionRepository : IQuestionRepository,
        @inject('ISavedQuestionRepository') private readonly _saveQuestionRepository : ISavedQuestionRepository,
    ) {}

    async execute(questionId: string ,userId:string): Promise<QuestionWithAuthorDTO> {
        console.log(userId)
        
        const question = await this._questionRepository.getQuestionWithAuthorData(questionId);

        if(!question) throw new NotFoundError('Question not found');

        const savedQuestion = await this._saveQuestionRepository.findByUserAndQuestion(userId,questionId);

        const isBookmarked = !!savedQuestion

        const mappedQuestion  =  QuestionMapper.toQuestionWithAuthor(question,isBookmarked);

        return mappedQuestion;
    }
}