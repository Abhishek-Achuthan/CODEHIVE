import { SessionStatus } from '../../domain/types/SessionStatus';

export interface CreateMentorAvailabilityDTO {
    mentorId:string;
    rrule:string;
    startTime:string;
    endTime:string;
    slotDurationMinutes:number;
    bufferMinutes?:number;
}

export interface BookSessionDTO {
    mentorId:string;
    userId:string;
    date:string;
    startTime:string;
    endTime:string;
    topic:string;
}

export interface MentorListinputDTO {
  search?:string;
  page?:number;
  limit?:number;
}

export interface ISessionResponseDTO {
  id: string;
  mentorId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  topic:string;
  createdAt: string;
  updatedAt: string;
  amountPaid: number;
  refunded:boolean
}

export interface IUserSummaryDTO {
  id: string;
  firstName: string;
  lastName: string;
}

export interface IBookedSessionResponseDTO {
  id: string;
  mentorId: string;
  userId: string;
  mentor: IUserSummaryDTO;
  user: IUserSummaryDTO;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  topic: string;
  amountPaid : number,
  refunded : boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSlotDTO {
  startTime: string; 
  endTime: string;   
}

