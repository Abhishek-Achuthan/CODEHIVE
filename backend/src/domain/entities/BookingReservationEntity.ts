import { BookingReservationStatus } from '../types/BookingReservationStatus';
import { RefundStatus } from '../types/RefundStatus';
import { SessionType } from '../types/SessionType';

export interface BookingReservationEntity {
  id: string;
  userId: string;
  mentorId: string;
  clientRequestId: string;
  date: string;
  startTime: Date;
  endTime: Date;
  topic: string;
  amount: number;
  currency: 'inr';
  status: BookingReservationStatus;
  stripePaymentIntentId?: string;
  sessionId: string | null;
  expiresAt: Date;
  lastStripeEventId: string | null;
  refundStatus: RefundStatus;
  sessionType: SessionType;
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
}
