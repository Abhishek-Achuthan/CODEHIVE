import { inject, injectable } from 'tsyringe';

import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import type { ISavedListItemRepository } from '../../../domain/interfaces/ISavedListItemRepository';
import type { IGetSavedListIdsForQuestionUseCase } from '../interface/qna/IGetSavedListIdsForQuestionUseCase';

@injectable()
export class GetSavedListIdsForQuestionUseCase
  implements IGetSavedListIdsForQuestionUseCase
{
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository,
    @inject('ISavedListItemRepository')
    private readonly _savedListItemRepository: ISavedListItemRepository
  ) {}

  async execute(
    userId: string,
    questionId: string
  ): Promise<{ listIds: string[] }> {
    const lists = await this._savedListRepository.listByUser(userId);

    if (lists.length === 0) return { listIds: [] };

    const userListIds = lists.map((l) => l.id);

    const listIds = await this._savedListItemRepository.findListIdsByQuestion(
      questionId,
      userListIds
    );

    return { listIds };
  }
}
