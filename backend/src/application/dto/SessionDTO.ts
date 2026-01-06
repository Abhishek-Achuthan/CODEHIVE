export interface CreateMentorAvailailityDTO {
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
}

export interface ISessionResponseDTO {
  id: string;
  mentorId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}
