import { VoteTargetType } from '../../types/VoteTargetType';
import { VoteValue } from '../../types/VoteValue';

export interface VoteEntity {
  id: string;
  userId: string;
  targetId: string;
  targetType: VoteTargetType;
  value: VoteValue;
  createdAt: Date;
  updatedAt: Date;
}
