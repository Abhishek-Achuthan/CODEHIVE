export interface SubmitPollVote {
  pollId: string;
  userId: string;
  optionIds: string[];
}