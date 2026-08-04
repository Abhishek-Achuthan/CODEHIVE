import type { ICreatePollOutputDTO } from '../../../dto/PollDTO';

export interface SubmitPollVoteInputDTO {
  pollId: string;
  userId: string;
  optionIds: string[];
}

export interface ISubmitPollVoteUseCase {
  execute(data: SubmitPollVoteInputDTO): Promise<ICreatePollOutputDTO>;
}
