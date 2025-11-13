import { VoteValue } from '../../domain/types/VoteValue';
import { VoteType } from '../../domain/types/VoteType';

export interface IVoteResponseDTO {
  id: string;
  userId: string;
  targetId: string;
  targetType: VoteType;
  value: VoteValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateVoteInputDTO {
  userId: string;
  targetId: string;               
  targetType: VoteType;
  value: VoteValue;
}
