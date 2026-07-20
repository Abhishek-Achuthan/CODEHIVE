import { PollEntity } from '../entities/room/PollEntity';
import { IGenericRepository } from './IGenericRepository';
import { SubmitPollVote } from '../types/SubmitPollVote';

export interface IPollRepository extends IGenericRepository<PollEntity> {
  findActivePollByRoomId(roomId: string): Promise<PollEntity | null>;
  submitVote(data: SubmitPollVote): Promise<PollEntity>;
  closePoll(pollId: string): Promise<PollEntity | null>;
  findClosedPollsByRoomId(roomId:string,isActive:boolean):Promise<PollEntity[] | []>
}
