import { Document, Schema, Types } from 'mongoose';
import { BookingReservationStatus } from '../../../../domain/types/BookingReservationStatus';
import { RefundStatus } from '../../../../domain/types/RefundStatus';
import { SessionType } from '../../../../domain/types/SessionType';

export interface BookingReservationDoc extends Document {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  mentorId: Schema.Types.ObjectId;
  clientRequestId: string;
  date: string;
  startTime: Date;
  endTime: Date;
  topic: string;
  amount: number;
  currency: 'inr';
  status: BookingReservationStatus;
  stripePaymentIntentId?: string;
  sessionId: Schema.Types.ObjectId | null;
  expiresAt: Date;
  lastStripeEventId: string | null;
  refundStatus: RefundStatus;
  sessionType: SessionType;
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingReservationLeanDoc {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  mentorId: Schema.Types.ObjectId;
  clientRequestId: string;
  date: string;
  startTime: Date;
  endTime: Date;
  topic: string;
  amount: number;
  currency: 'inr';
  status: BookingReservationStatus;
  stripePaymentIntentId?: string;
  sessionId: Schema.Types.ObjectId | null;
  expiresAt: Date;
  lastStripeEventId: string | null;
  refundStatus: RefundStatus;
  sessionType: SessionType;
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
}

export const BookingReservationSchema = new Schema<BookingReservationDoc>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: Types.ObjectId, ref: 'User', required: true },
    clientRequestId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    topic: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['inr'], required: true },
    status: {
      type: String,
      enum: Object.values(BookingReservationStatus),
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: undefined,
    },
    sessionId: { type: Types.ObjectId, ref: 'Session', default: null },
    expiresAt: { type: Date, required: true },
    lastStripeEventId: { type: String, default: null },
    refundStatus: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.NONE,
      required: true,
    },
    sessionType: { type: String, enum: Object.values(SessionType), required: true, default: SessionType.ONE_TO_ONE },
    maxGuests: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

BookingReservationSchema.index(
  { stripePaymentIntentId: 1 },
  {
    unique: true,
    name: 'unique_booking_reservation_payment_intent',
    partialFilterExpression: {
      stripePaymentIntentId: { $type: 'string' },
    },
  }
);

BookingReservationSchema.index(
  { userId: 1, mentorId: 1, date: 1, startTime: 1, clientRequestId: 1 },
  { unique: true, name: 'unique_booking_start_request' }
);

BookingReservationSchema.index(
  { mentorId: 1, date: 1, startTime: 1, endTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: BookingReservationStatus.PENDING_PAYMENT,
    },
    name: 'unique_pending_reservation_slot',
  }
);

BookingReservationSchema.index(
  { mentorId: 1, date: 1, status: 1, expiresAt: 1 },
  { name: 'booking_reservation_availability_lookup' }
);
