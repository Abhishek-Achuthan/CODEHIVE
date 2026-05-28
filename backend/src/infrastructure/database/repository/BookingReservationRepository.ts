import { ClientSession } from 'mongoose';
import { injectable } from 'tsyringe';
import {
  CreateBookingReservationInput,
  IBookingReservationRepository,
} from '../../../domain/interfaces/IBookingReservationRepository';
import { BookingReservationEntity } from '../../../domain/entities/BookingReservationEntity';
import { BookingReservationModel } from '../models/payment/BookingReservationModel';
import { BookingReservationLeanDoc } from '../schemas/payment/BookingReservationSchema';
import { BookingReservationStatus } from '../../../domain/types/BookingReservationStatus';
import { RefundStatus } from '../../../domain/types/RefundStatus';

@injectable()
export class BookingReservationRepository
  implements IBookingReservationRepository
{
  async create(
    data: CreateBookingReservationInput,
    session?: ClientSession
  ): Promise<BookingReservationEntity> {
    const docs = session
      ? await BookingReservationModel.create([data], { session })
      : await BookingReservationModel.create([data]);
    return this.toEntity(docs[0]!);
  }

  async findById(id: string): Promise<BookingReservationEntity | null> {
    const doc = await BookingReservationModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByIdAndUser(
    id: string,
    userId: string
  ): Promise<BookingReservationEntity | null> {
    const doc = await BookingReservationModel.findOne({ _id: id, userId });
    return doc ? this.toEntity(doc) : null;
  }

  async findByBookingStartKey(
    userId: string,
    mentorId: string,
    date: string,
    startTime: Date,
    clientRequestId: string
  ): Promise<BookingReservationEntity | null> {
    const doc = await BookingReservationModel.findOne({
      userId,
      mentorId,
      date,
      startTime,
      clientRequestId,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async findByStripePaymentIntentId(
    stripePaymentIntentId: string,
    session?: ClientSession
  ): Promise<BookingReservationEntity | null> {
    const query = BookingReservationModel.findOne({ stripePaymentIntentId });
    if (session) {
      query.session(session);
    }
    const doc = await query;
    return doc ? this.toEntity(doc) : null;
  }

  async findActivePendingByMentorAndDate(
    mentorId: string,
    date: string,
    now: Date
  ): Promise<BookingReservationEntity[]> {
    const docs = await BookingReservationModel.find({
      mentorId,
      date,
      status: BookingReservationStatus.PENDING_PAYMENT,
      expiresAt: { $gt: now },
    }).lean<BookingReservationLeanDoc[]>();

    return docs.map((doc) => this.toLeanEntity(doc));
  }

  async expirePendingForSlot(
    mentorId: string,
    date: string,
    startTime: Date,
    endTime: Date,
    now: Date
  ): Promise<void> {
    await BookingReservationModel.updateMany(
      {
        mentorId,
        date,
        startTime,
        endTime,
        status: BookingReservationStatus.PENDING_PAYMENT,
        expiresAt: { $lte: now },
      },
      {
        $set: {
          status: BookingReservationStatus.EXPIRED,
        },
      }
    );
  }

  async update(
    id: string,
    data: Partial<CreateBookingReservationInput>,
    session?: ClientSession
  ): Promise<BookingReservationEntity | null> {
    const options = session ? { new: true, session } : { new: true };
    const updated = await BookingReservationModel.findByIdAndUpdate(
      id,
      data,
      options
    );
    return updated ? this.toEntity(updated) : null;
  }

  async listReservationsNeedingRefund(
    limit: number
  ): Promise<BookingReservationEntity[]> {
    const docs = await BookingReservationModel.find({
      refundStatus: { $in: [RefundStatus.REQUIRED, RefundStatus.PENDING] },
      stripePaymentIntentId: { $type: 'string' },
    })
      .sort({ updatedAt: 1 })
      .limit(limit)
      .lean<BookingReservationLeanDoc[]>();

    return docs.map((doc) => this.toLeanEntity(doc));
  }

  private toEntity(doc: BookingReservationLeanDoc): BookingReservationEntity {
    return this.toLeanEntity(doc);
  }

  private toLeanEntity(doc: BookingReservationLeanDoc): BookingReservationEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      mentorId: doc.mentorId.toString(),
      clientRequestId: doc.clientRequestId,
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      topic: doc.topic,
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      ...(doc.stripePaymentIntentId
        ? { stripePaymentIntentId: doc.stripePaymentIntentId }
        : {}),
      sessionId: doc.sessionId ? doc.sessionId.toString() : null,
      expiresAt: doc.expiresAt,
      lastStripeEventId: doc.lastStripeEventId,
      refundStatus: doc.refundStatus,
      guestCount: doc.guestCount ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
