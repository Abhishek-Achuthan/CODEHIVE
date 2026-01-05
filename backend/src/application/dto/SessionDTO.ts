export interface CreateMentorAvailailityDTO {
    mentorId:string;
    rrule:string;
    startTime:string;
    endTime:string;
    slotDurationMinutes:number;
    bufferMinutes?:number;
}