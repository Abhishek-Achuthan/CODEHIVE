import { model } from 'mongoose';
import {
  BookingReservationDoc,
  BookingReservationSchema,
} from '../../schemas/payment/BookingReservationSchema';

export const BookingReservationModel = model<BookingReservationDoc>(
  'BookingReservation',
  BookingReservationSchema
);
