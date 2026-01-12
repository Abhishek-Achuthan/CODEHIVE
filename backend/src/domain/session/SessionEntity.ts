import { SessionStatus } from '../types/SessionStatus';

export interface SessionEntity {
    id:string;
    mentorId:string;
    userId:string;
    date:string;
    startTime:Date;
    endTime:Date;
    status: SessionStatus;
    topic:string;
    amountPaid:number;
    refunded : boolean;
    createdAt:Date;
    updatedAt:Date;
}