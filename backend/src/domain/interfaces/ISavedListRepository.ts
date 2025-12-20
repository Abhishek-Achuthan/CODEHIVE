import { IGenericRepository } from './IGenericRepository';
import { SavedListEntity } from '../entities/qna/SavedListEntity';

export interface ISavedListRepository extends IGenericRepository<SavedListEntity> {
  listByUser(userId: string): Promise<SavedListEntity[]>;
  findByUserAndName(userId: string, name: string): Promise<SavedListEntity | null>;
}
