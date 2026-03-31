import { inject, injectable } from 'tsyringe';
import type { IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IBookingReservationRepository } from '../../../domain/interfaces/IBookingReservationRepository';
import type { IRRuleSlotService } from '../../ports/slot/IRRuleSlotService';
import type { ISlotConflictService } from '../../ports/slot/ISlotConflictService';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { ILoggerService } from '../../ports/logging/ILoggerService';
import type { IPaymentService } from '../../ports/payment/IPaymentService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import { BookingReservationStatus } from '../../../domain/types/BookingReservationStatus';
import { RefundStatus } from '../../../domain/types/RefundStatus';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../../domain/types/PaymentSource';
import { SessionMapper } from '../../mapper/SessionMapper';
import { BookSessionDTO } from '../../dto/SessionDTO';
import type {
  IBookSessionWithStripeUseCase,
  StripeCheckoutResponseDTO,
} from '../interface/session/IBookSessionWithStripeUseCase';
import type { SessionEntity } from '../../../domain/session/SessionEntity';
import type { BookingReservationEntity } from '../../../domain/entities/BookingReservationEntity';

@injectable()
export class BookSessionWithStripeUseCase implements IBookSessionWithStripeUseCase {
  constructor(
    @inject('IMentorAvailabilityRepository')
    private readonly _availabilityRepo: IMentorAvailabilityRepository,
    @inject('ISessionRepository')
    private readonly _sessionRepo: ISessionRepository,
    @inject('IBookingReservationRepository')
    private readonly _bookingReservationRepository: IBookingReservationRepository,
    @inject('IRRuleSlotService')
    private readonly _rruleSlotService: IRRuleSlotService,
    @inject('ISlotConflictService')
    private readonly _slotConflictService: ISlotConflictService,
    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @inject('IPaymentService')
    private readonly _paymentService: IPaymentService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService
  ) {}

  async execute(input: BookSessionDTO): Promise<StripeCheckoutResponseDTO> {
    const { mentorId, userId, date, startTime, endTime, topic, clientRequestId } =
      input;

    const mentor = await this._userRepository.find(mentorId);

    if (
      !mentor ||
      mentor.role !== UserRole.MENTOR ||
      mentor.mentorStatus !== MentorStatus.APPROVED
    ) {
      throw new NotFoundError(ERROR_MESSAGES.SESSION.MENTOR_NOT_FOUND);
    }

    const availabilities = await this._availabilityRepo.findByMentor(mentorId);

    if (availabilities.length === 0) {
      throw new ConflictError(ERROR_MESSAGES.SESSION.NO_AVAILABILITY);
    }

    const from = new Date(date);
    from.setHours(0, 0, 0, 0);

    const to = new Date(date);
    to.setHours(23, 59, 59, 999);

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);
    const now = new Date();

    const bookingStartKey = `booking:start:${userId}:${mentorId}:${date}:${startTime}:${clientRequestId}`;

    const existingReservation =
      await this._bookingReservationRepository.findByBookingStartKey(
        userId,
        mentorId,
        date,
        start,
        clientRequestId
      );

    if (
      existingReservation &&
      existingReservation.stripePaymentIntentId &&
      existingReservation.status !== BookingReservationStatus.EXPIRED
    ) {
      return {
        reservation:
          SessionMapper.toBookingReservationResponse(existingReservation),
        clientSecret: await this._paymentService.getPaymentIntentClientSecret(
          existingReservation.stripePaymentIntentId
        ),
        paymentIntentId: existingReservation.stripePaymentIntentId,
        expiresAt: existingReservation.expiresAt.toISOString(),
      };
    }

    const derivedSlots = this._rruleSlotService.generateSlots(
      availabilities,
      from,
      to
    );

    const existingSessions = await this._sessionRepo.findByMentorAndDate(
      mentorId,
      date
    );
    const activeReservations =
      await this._bookingReservationRepository.findActivePendingByMentorAndDate(
        mentorId,
        date,
        now
      );

    const freeSlots = this._slotConflictService.filterBookedSlots(
      derivedSlots,
      [
        ...existingSessions,
        ...activeReservations.map((reservation) =>
          this.toSessionLikeLock(reservation)
        ),
      ]
    );

    const matchedSlot = freeSlots.find(
      (slot) =>
        slot.date === date &&
        slot.startTime === startTime &&
        slot.endTime === endTime
    );

    if (!matchedSlot) {
      throw new ConflictError('Selected slot is no longer available');
    }

    await this._bookingReservationRepository.expirePendingForSlot(
      mentorId,
      date,
      start,
      end,
      now
    );

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    let reservation: BookingReservationEntity;

    try {
      reservation = await this._bookingReservationRepository.create({
        userId,
        mentorId,
        clientRequestId,
        date,
        startTime: start,
        endTime: end,
        topic,
        amount: matchedSlot.price,
        currency: 'inr',
        status: BookingReservationStatus.PENDING_PAYMENT,
        sessionId: null,
        expiresAt,
        lastStripeEventId: null,
        refundStatus: RefundStatus.NONE,
      });
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        const conflictingReservation =
          await this._bookingReservationRepository.findActivePendingByMentorAndDate(
            mentorId,
            date,
            now
          );
        const sameSlotConflict = conflictingReservation.find(
          (entry) =>
            entry.startTime.getTime() === start.getTime() &&
            entry.endTime.getTime() === end.getTime()
        );

        if (sameSlotConflict) {
          throw new ConflictError('Selected slot is no longer available');
        }
      }

      throw error;
    }

    this._logger.info('reservation.created', {
      reservationId: reservation.id,
      userId,
      mentorId,
      slot: {
        date,
        startTime,
        endTime,
      },
      bookingStartKey,
    });

    const payment = await this._paymentService.createPaymentIntent({
      amount: matchedSlot.price,
      currency: 'inr',
      idempotencyKey: `pi:create:${reservation.id}`,
      metadata: {
        reservationId: reservation.id,
        mentorId,
        userId,
        date,
        startTime,
        endTime,
      },
    });

    this._logger.info('payment_intent.created', {
      reservationId: reservation.id,
      paymentIntentId: payment.paymentIntentId,
    });

    const updatedReservation = await this._bookingReservationRepository.update(
      reservation.id,
      {
        stripePaymentIntentId: payment.paymentIntentId,
      }
    );

    if (!updatedReservation) {
      throw new ConflictError('Booking reservation could not be updated');
    }

    return {
      reservation: SessionMapper.toBookingReservationResponse(updatedReservation),
      clientSecret: payment.clientSecret,
      paymentIntentId: payment.paymentIntentId,
      expiresAt: updatedReservation.expiresAt.toISOString(),
    };
  }

  private toSessionLikeLock(
    reservation: BookingReservationEntity
  ): SessionEntity {
    return {
      id: reservation.id,
      mentorId: reservation.mentorId,
      userId: reservation.userId,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
            status: SessionStatus.UPCOMING,
            topic: reservation.topic,
            paymentStatus: SessionPaymentStatus.PENDING,
            paymentSource: PaymentSource.STRIPE,
            paymentReferenceId: reservation.stripePaymentIntentId ?? null,
            amount: reservation.amount,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
        };
    }

  private isDuplicateKeyError(error: unknown): error is { code: number } {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
  }
}
