import { inject, injectable } from 'tsyringe';
import { IRemoveQuestionFromSavedListUseCase } from '../interface/qna/IRemoveQuestionFromSavedListUseCase';
import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import type { ISavedListItemRepository } from '../../../domain/interfaces/ISavedListItemRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class RemoveQuestionFromSavedListUseCase
  implements IRemoveQuestionFromSavedListUseCase
{
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository,
    @inject('ISavedListItemRepository')
    private readonly _savedListItemRepository: ISavedListItemRepository
  ) {}

  async execute(userId: string, listId: string, questionId: string): Promise<void> {
    const list = await this._savedListRepository.find(listId);

    if (!list || list.userId !== userId) throw new NotFoundError(ERROR_MESSAGES.QnA.LIST_NOT_FOUND);

    await this._savedListItemRepository.deleteByListAndQuestion(listId, questionId);
  }
}
