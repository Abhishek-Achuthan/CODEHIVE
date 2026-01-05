export interface SessionEntity {
    id:string;
    mentorId:string;
    userId:string;
    date:string;
    startTime:string;
    endTime:string;
    status:'upcoming' | 'completed'|'cancelled'
    createdAt:Date;
    updatedAt:Date;
}