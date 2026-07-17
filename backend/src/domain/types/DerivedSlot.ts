import { SessionType } from './SessionType';

export interface DerivedSlot {
    mentorId:string;
    availabilityId:string;
    date:string;
    startTime:string;
    price:number;
    endTime:string;
    sessionType: SessionType;
    maxGuests: number;
}