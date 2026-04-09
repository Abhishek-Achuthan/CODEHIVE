import { inject,injectable } from 'tsyringe';
import { IListAnsweredQuestionUseCase } from '../interface/qna/IListAnsweredQuestionsUseCase';
import { type IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import { type IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { QuestionListQuery } from '../../../domain/types/QuestionListQuery';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class listAnsweredQuestionUseCase implements IListAnsweredQuestionUseCase {
     constructor(
        @inject('IAnswerRepository') private readonly _answerRepository : IAnswerRepository,
        @inject('IQuestionRepository') private readonly _questionRepository : IQuestionRepository
     ){}

     async execute(userId: string, data: QuestionListQuery): Promise<PaginationResult<QuestionEntity>> {
         const questionIds  = await this._answerRepository.findAnsweredQuestionIdsByUser(userId);

         if(questionIds.length<=0) throw new NotFoundError(ERROR_MESSAGES.QnA.NO_ANSWERED_QUESTIONS);

         const items = await this._questionRepository.listAnsweredByUser(questionIds,data);

         return items;
     }
}
