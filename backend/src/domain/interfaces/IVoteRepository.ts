import { VoteEntity } from '../entities/qna/VoteEntity';
import { VoteTargetType } from '../types/VoteTargetType';
import { IGenericRepository } from './IGenericRepository';

export interface IVoteRepository extends IGenericRepository<VoteEntity> {
  findByUserAndTarget(
    userId: string,
    targetId: string,
    targetType: VoteTargetType
  ): Promise<VoteEntity | null>;

  deleteByTarget(targetId: string, targetType: VoteTargetType): Promise<void>;
  deleteByTargetIds(targetIds: string[], targetType: VoteTargetType): Promise<void>;
}
