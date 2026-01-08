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
  status: 'upcoming' | 'completed' | 'cancelled';
  topic:string;
}

export interface AvailableSlotDTO {
  startTime: string; 
  endTime: string;   
}

