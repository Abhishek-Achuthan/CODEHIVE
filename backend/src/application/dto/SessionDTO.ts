import { PaymentSource } from '../../domain/types/PaymentSource';
import { SessionPaymentStatus } from '../../domain/types/SessionPaymentStatus';
import { SessionStatus } from '../../domain/types/SessionStatus';

export interface CreateMentorAvailabilityDTO {
  mentorId: string;
  rrule: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  bufferMinutes?: number;
}

export interface BookSessionDTO {
  mentorId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
}

export interface MentorListinputDTO {
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface ISessionResponseDTO {
  id: string;
  mentorId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  paymentSource: PaymentSource;
  paymentStatus: SessionPaymentStatus;
  topic: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
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
  paymentSource: PaymentSource;
  paymentStatus: SessionPaymentStatus;
  amount: number,
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSlotDTO {
  startTime: string;
  endTime: string;
  price: number;
}

