import { VoteValue } from '../../domain/types/VoteValue';
import { VoteTargetType } from '../../domain/types/VoteTargetType';

export interface IVoteResponseDTO {
  id: string;
  userId: string;
  targetId: string;
  targetType: VoteTargetType;
  value: VoteValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateVoteInputDTO {
  userId: string;
  targetId: string;               
  targetType: VoteTargetType;
  value: VoteValue;
}
