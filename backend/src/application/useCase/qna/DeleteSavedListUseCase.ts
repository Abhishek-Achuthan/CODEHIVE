import { inject, injectable } from 'tsyringe';

import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import type { ISavedListItemRepository } from '../../../domain/interfaces/ISavedListItemRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IDeleteSavedListUseCase } from '../interface/qna/IDeleteSavedListUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class DeleteSavedListUseCase implements IDeleteSavedListUseCase {
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository,
    @inject('ISavedListItemRepository')
    private readonly _savedListItemRepository: ISavedListItemRepository
  ) {}

  async execute(userId: string, listId: string): Promise<void> {
    const list = await this._savedListRepository.find(listId);

    if (!list || list.userId !== userId) throw new NotFoundError(ERROR_MESSAGES.QnA.LIST_NOT_FOUND);

    await this._savedListItemRepository.deleteByList(listId);

    await this._savedListRepository.delete(listId);
  }
}
