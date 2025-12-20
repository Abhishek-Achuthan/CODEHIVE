import { IGenericRepository } from './IGenericRepository';
import { SavedListItemEntity } from '../entities/qna/SavedListItemEntity';

export interface ISavedListItemRepository
  extends IGenericRepository<SavedListItemEntity>
{
  exists(listId: string, questionId: string): Promise<boolean>;
  deleteByList(listId: string): Promise<void>;
  deleteByQuestion(questionId: string): Promise<void>;
  deleteByListAndQuestion(
    listId: string,
    questionId: string
  ): Promise<void>;
  findQuestionIdsByList(listId: string): Promise<string[]>;
  findListIdsByQuestion(questionId: string, listIds: string[]): Promise<string[]>;
}
