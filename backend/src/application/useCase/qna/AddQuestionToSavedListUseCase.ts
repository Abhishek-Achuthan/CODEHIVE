import { inject, injectable } from 'tsyringe';
import { IAddQuestionToSavedListUseCase } from '../interface/qna/IAddQuestionToSavedListUseCase';
import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import type { ISavedListItemRepository } from '../../../domain/interfaces/ISavedListItemRepository';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import type { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class AddQuestionToSavedListUseCase implements IAddQuestionToSavedListUseCase {
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository,
    @inject('ISavedListItemRepository')
    private readonly _savedListItemRepository: ISavedListItemRepository,
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository,
    @inject('ISavedQuestionRepository')
    private readonly _savedQuestionRepository: ISavedQuestionRepository
  ) {}

  async execute(userId: string, listId: string, questionId: string): Promise<void> {
    const list = await this._savedListRepository.find(listId);

    if (!list || list.userId !== userId) throw new NotFoundError('List not found');

    const question = await this._questionRepository.find(questionId);

    if (!question) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

    const isAlreadyInList = await this._savedListItemRepository.exists(listId, questionId);

    if (!isAlreadyInList) {
      await this._savedListItemRepository.create({ listId, questionId });
    }

    const existingSave = await this._savedQuestionRepository.findByUserAndQuestion(
      userId,
      questionId
    );

    if (!existingSave) {
      await this._savedQuestionRepository.create({ userId, questionId });
    }
  }
}
