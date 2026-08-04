import { SessionType } from '../types/SessionType';

export interface MentorAvailabilityEntity {
  id: string;
  mentorId: string;
  rrule: string;
  exdates: string[];
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  bufferMinutes: number;
  slotPrice: number;
  sessionType: SessionType;
  maxGuests: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
