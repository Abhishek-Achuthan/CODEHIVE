import { inject,injectable } from 'tsyringe';
import { IAcceptAnswerUseCase } from '../interface/qna/IAcceptAnswerUseCase';
import { type IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import { type IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { IAcceptAnswerInputDTO, IAnswerResponseDTO } from '../../dto/AnswerDTO';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { type IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UnauthorizedError } from '../../../core/errors/UnauthorizedError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { AnswerMapper } from '../../mapper/AnswerMapper';

@injectable()
export class AcceptAnswerUseCase implements IAcceptAnswerUseCase {

    constructor(
        @inject('IAnswerRepository') private readonly _answerRepository : IAnswerRepository,
        @inject('IQuestionRepository') private readonly _questionRepository : IQuestionRepository,
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
    ) {}

    async execute(data: IAcceptAnswerInputDTO): Promise<IAnswerResponseDTO | null> {

        const question = await this._questionRepository.find(data.questionId);

        if(!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);
        
        if (question?.acceptedAnswerId !== null) throw new ConflictError('Question already have accepted answer');

        const answer = await this._answerRepository.find(data.answerId);

        if(!answer) throw new NotFoundError(ERROR_MESSAGES.QnA.ANSWER_NOT_FOUND);

        if(answer.questionId !== question.id) throw new ConflictError('Answer is not of this question')

        if(question.askedBy !== data.userId) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.UNAUTHORIZED);

        const [updatedAnswer] = await Promise.all([
            this._answerRepository.update(data.answerId,{
                isAccepted:true,
            }),
            this._questionRepository.update(data.questionId,{
                acceptedAnswerId:data.answerId,
                isAnswered:true,      
            })
        ])
        return updatedAnswer ? AnswerMapper.toAnswerResponse(updatedAnswer) : null
    }
}