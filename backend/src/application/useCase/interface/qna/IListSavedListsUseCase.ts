import { SavedListEntity } from '../../../../domain/entities/qna/SavedListEntity';

export interface IListSavedListsUseCase {
  execute(userId: string): Promise<SavedListEntity[]>;
}
