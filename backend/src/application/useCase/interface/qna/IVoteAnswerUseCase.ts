import { VoteValue } from '../../../../domain/types/VoteValue';

export interface IVoteAnswerUseCase {
  execute(
    answerId: string,
    userId: string,
    value: VoteValue
  ): Promise<{ voteCount: number; userVote: VoteValue | 0 }>;
}
