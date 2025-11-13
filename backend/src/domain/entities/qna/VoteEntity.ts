import { VoteType } from '../../types/VoteType';
import { VoteValue } from '../../types/VoteValue';

export interface VoteEntity {
  id: string;
  userId: string;
  targetId: string;
  targetType: VoteType;
  value: VoteValue;
  createdAt: Date;
  updatedAt: Date;
}
