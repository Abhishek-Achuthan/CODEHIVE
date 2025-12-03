import { inject,injectable } from 'tsyringe';
import { ISaveQuestionUseCase } from '../interface/qna/ISaveQuestionUseCase';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import type { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import { SavedQuestionEntity } from '../../../domain/entities/qna/SavedQuestionEntity';



injectable()
export class SavedQuestionUseCase implements ISaveQuestionUseCase {
    constructor(
        @inject('IQuestionRepository') private readonly _questionRepository: IQuestionRepository,
        @inject('ISavedQuestionRepository') private readonly _savedQuestionRepository: ISavedQuestionRepository
    ){}

    async execute(questionId: string,userId:string): Promise<SavedQuestionEntity> {
        const question = await this._questionRepository.find(questionId);

        if(!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);
        
        const savedQuestion = await this._savedQuestionRepository.create({
            questionId,
            userId,
        });

        return savedQuestion
    }
}