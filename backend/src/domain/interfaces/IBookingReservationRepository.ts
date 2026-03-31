import { ClientSession } from 'mongoose';
import { BookingReservationEntity } from '../entities/BookingReservationEntity';
import { BookingReservationStatus } from '../types/BookingReservationStatus';
import { RefundStatus } from '../types/RefundStatus';

export interface CreateBookingReservationInput {
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
}

export interface IBookingReservationRepository {
  create(
    data: CreateBookingReservationInput,
    session?: ClientSession
  ): Promise<BookingReservationEntity>;
  findById(id: string): Promise<BookingReservationEntity | null>;
  findByIdAndUser(
    id: string,
    userId: string
  ): Promise<BookingReservationEntity | null>;
  findByBookingStartKey(
    userId: string,
    mentorId: string,
    date: string,
    startTime: Date,
    clientRequestId: string
  ): Promise<BookingReservationEntity | null>;
  findByStripePaymentIntentId(
    stripePaymentIntentId: string,
    session?: ClientSession
  ): Promise<BookingReservationEntity | null>;
  findActivePendingByMentorAndDate(
    mentorId: string,
    date: string,
    now: Date
  ): Promise<BookingReservationEntity[]>;
  expirePendingForSlot(
    mentorId: string,
    date: string,
    startTime: Date,
    endTime: Date,
    now: Date
  ): Promise<void>;
  update(
    id: string,
    data: Partial<CreateBookingReservationInput>,
    session?: ClientSession
  ): Promise<BookingReservationEntity | null>;
  listReservationsNeedingRefund(limit: number): Promise<BookingReservationEntity[]>;
}
