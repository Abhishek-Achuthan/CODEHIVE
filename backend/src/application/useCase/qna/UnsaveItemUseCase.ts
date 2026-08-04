import { inject,injectable } from 'tsyringe';
import { IUnsaveItemUseCase } from '../interface/qna/IUnsaveItemUseCase';
import { type IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { type ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';

@injectable()
export class UnsaveItemUseCase implements IUnsaveItemUseCase {
    constructor(
        @inject('IQuestionRepository') private readonly _questionRepository: IQuestionRepository,
        @inject('ISavedQuestionRepository') private readonly _savedQuestionRepository: ISavedQuestionRepository,
    ){}

    async execute(questionId:string,userId:string):Promise<boolean>{
      const question = await this._questionRepository.find(questionId);

        if(!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

        const isSaved = await this._savedQuestionRepository.findByUserAndQuestion(userId,questionId);

        if(!isSaved) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

        await this._savedQuestionRepository.delete(isSaved.id);

        return true;
    }
}