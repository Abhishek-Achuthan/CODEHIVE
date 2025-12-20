import { VoteValue } from '../../../../domain/types/VoteValue';

export interface IVoteQuestionUseCase  {
    execute(questionId: string, userId: string, value: VoteValue): Promise<{ votes: number; userVote: VoteValue | 0 }>;
}