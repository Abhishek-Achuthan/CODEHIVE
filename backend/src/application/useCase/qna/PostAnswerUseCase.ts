import { IPostAnswerUseCase } from '../interface/qna/IPostAnswerUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { inject, injectable } from 'tsyringe';
import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import { ICreateAnswerInputDTO } from '../../dto/AnswerDTO';
import { AnswerEntity } from '../../../domain/entities/qna/AnswerEntity';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class PostAnswerUseCase implements IPostAnswerUseCase {
  constructor(
    @inject('IQuestionRepository') private readonly _questionRepository: IQuestionRepository,
    @inject('IAnswerRepository') private readonly _answerRepository: IAnswerRepository,
  ) {}

  async execute(data: ICreateAnswerInputDTO): Promise<AnswerEntity> {
    const { answerText, questionId, answeredBy } = data;

    const question = await this._questionRepository.find(data.questionId);

    if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);
    
    if (question.acceptedAnswerId) throw new ForbiddenError(ERROR_MESSAGES.QnA.ALREADY_ANSWERED);
    
    const answer = await this._answerRepository.create({ questionId, answeredBy, answerText });

    await this._questionRepository.incrementAnswerCountAndSetAnswered(questionId,1);

    return answer;
  }
}
