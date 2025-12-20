import { inject, injectable } from 'tsyringe';
import { IGetQuestionUseCase } from '../interface/qna/IGetQuestionUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { QuestionWithAuthorDTO } from '../../dto/QuestionDTO';
import type { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import { QuestionMapper } from '../../mapper/QuestionMapper';
import type { IRecordQuestionViewUseCase } from '../interface/qna/IRecordQuestionViewUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class GetQuestionUseCase implements IGetQuestionUseCase {
    constructor(
        @inject('IQuestionRepository') private readonly _questionRepository: IQuestionRepository,
        @inject('ISavedQuestionRepository') private readonly _saveQuestionRepository: ISavedQuestionRepository,
        @inject('IRecordQuestionViewUseCase') private readonly _recordQuestionViewUseCase: IRecordQuestionViewUseCase,
    ) {}

    async execute(questionId: string, userId: string): Promise<QuestionWithAuthorDTO> {
        
        const question = await this._questionRepository.getQuestionWithAuthorData(questionId);

        if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

        const isFirstView = await this._recordQuestionViewUseCase.execute(questionId, userId);

        if (isFirstView) {
            question.question.views = (question.question.views ?? 0) + 1;
        }

        const savedQuestion = await this._saveQuestionRepository.findByUserAndQuestion(userId, questionId);

        const isBookmarked = !!savedQuestion;

        const mappedQuestion = QuestionMapper.toQuestionWithAuthor(question, isBookmarked);

        return mappedQuestion;
    }
}