import { inject, injectable } from 'tsyringe';
import { IListSavedListsUseCase } from '../interface/qna/IListSavedListsUseCase';
import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import { SavedListEntity } from '../../../domain/entities/qna/SavedListEntity';

@injectable()
export class ListSavedListsUseCase implements IListSavedListsUseCase {
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository
  ) {}

  async execute(userId: string): Promise<SavedListEntity[]> {
    return this._savedListRepository.listByUser(userId);
  }
}
