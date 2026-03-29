import { Experience } from '../../domain/types/ExperienceType';
import { MentorStatus } from '../../domain/types/MentorStatus';
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

export interface MentorListInputDTO {
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

export interface IMentorProfileResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | undefined;
  about?: string | undefined;
  skills: string[];
  experience: Experience[];
  avatarUrl?: string | undefined;
  githubUrl?: string | undefined;
  linkedInUrl?: string | undefined;
  websiteUrl?: string | undefined;
  primaryExpertise?: string | undefined;
  experienceLevel?: string | undefined;
  email: string;
}

