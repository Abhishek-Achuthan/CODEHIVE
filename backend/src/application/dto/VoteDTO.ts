import { VoteValue } from '../../domain/types/VoteValue';
import { VoteType } from '../../domain/types/VoteType';

export interface VoteResponseDTO {
  id: string;
  userId: string;
  targetId: string;
  targetType: VoteType;
  value: VoteValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVoteInputDTO {
  userId: string;
  targetId: string;               
  targetType: VoteType;
  value: VoteValue;
}
