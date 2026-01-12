export interface MentorAvailabilityEntity {
  id: string;
  mentorId: string;
  rrule:string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  bufferMinutes: number;
  slotPrice:number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
