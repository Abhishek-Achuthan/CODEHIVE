import { inject, injectable } from 'tsyringe';
import mongoose from 'mongoose';
import type { WebhookEvent } from '../../../domain/types/WebhookEvent';
import type { IHandleStripeWebhookUseCase } from '../interface/payment/IHandleStripeWebhookUseCase';
import type { IStripeWebhookEventRepository } from '../../../domain/interfaces/IStripeWebhookEventRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IBookingReservationRepository } from '../../../domain/interfaces/IBookingReservationRepository';
import type { ILoggerService } from '../../ports/logging/ILoggerService';
import type { IPaymentService } from '../../ports/payment/IPaymentService';
import { BookingReservationStatus } from '../../../domain/types/BookingReservationStatus';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../../domain/types/PaymentSource';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { RefundStatus } from '../../../domain/types/RefundStatus';
import { ConflictError } from '../../../core/errors/ConflictError';

interface StripePaymentIntentObject {
  id: string;
}

@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(
    @inject('IStripeWebhookEventRepository')
    private readonly _stripeWebhookEventRepository: IStripeWebhookEventRepository,
    @inject('ISessionRepository')
    private readonly _sessionRepository: ISessionRepository,
    @inject('IBookingReservationRepository')
    private readonly _bookingReservationRepository: IBookingReservationRepository,
    @inject('IPaymentService')
    private readonly _paymentService: IPaymentService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService
  ) {}

  async execute(event: WebhookEvent): Promise<void> {
    const paymentIntent = this.getPaymentIntent(event.data);

    if (!paymentIntent) {
      return;
    }

    this._logger.info('webhook.received', {
      eventId: event.id,
      type: event.type,
    });

    const dbSession = await mongoose.startSession();

    try {
      await dbSession.withTransaction(async () => {
        const beginResult =
          await this._stripeWebhookEventRepository.beginProcessing(
            event.id,
            event.type,
            dbSession
          );

        if (beginResult === 'processed') {
          this._logger.info('webhook.duplicate_suppressed', { eventId: event.id });
          return;
        }

        if (beginResult === 'processing') {
          return;
        }

        const reservation =
          await this._bookingReservationRepository.findByStripePaymentIntentId(
            paymentIntent.id,
            dbSession
          );

        if (!reservation) {
          await this._stripeWebhookEventRepository.markProcessed(
            event.id,
            dbSession
          );
          return;
        }

        if (
          reservation.status === BookingReservationStatus.FULFILLED ||
          reservation.status === BookingReservationStatus.FAILED ||
          reservation.status === BookingReservationStatus.EXPIRED
        ) {
          await this._stripeWebhookEventRepository.markProcessed(
            event.id,
            dbSession
          );
          return;
        }

        if (event.type === 'payment_intent.succeeded') {
          if (reservation.expiresAt.getTime() < Date.now()) {
            await this.transitionReservation(
              reservation.id,
              reservation.status,
              BookingReservationStatus.FAILED,
              dbSession,
              {
                refundStatus: RefundStatus.REQUIRED,
                lastStripeEventId: event.id,
              }
            );

            await this.handleRefundRequirement(
              reservation.id,
              paymentIntent.id,
              dbSession
            );
            await this._stripeWebhookEventRepository.markProcessed(
              event.id,
              dbSession
            );
            return;
          }

          await this.transitionReservation(
            reservation.id,
            reservation.status,
            BookingReservationStatus.PROCESSING,
            dbSession,
            {
              lastStripeEventId: event.id,
            }
          );

          try {
            const session = await this._sessionRepository.createWithSession(
              {
                mentorId: reservation.mentorId,
                userId: reservation.userId,
                date: reservation.date,
                startTime: reservation.startTime,
                endTime: reservation.endTime,
                status: SessionStatus.UPCOMING,
                paymentSource: PaymentSource.STRIPE,
                paymentStatus: SessionPaymentStatus.PAID,
                paymentReferenceId: reservation.stripePaymentIntentId ?? null,
                topic: reservation.topic,
                amount: reservation.amount,
              },
              dbSession
            );

            await this.transitionReservation(
              reservation.id,
              BookingReservationStatus.PROCESSING,
              BookingReservationStatus.FULFILLED,
              dbSession,
              {
                sessionId: session.id,
                lastStripeEventId: event.id,
              }
            );

            this._logger.info('fulfillment.success', {
              reservationId: reservation.id,
              sessionId: session.id,
            });
          } catch (error) {
            if (this.isDuplicateKeyError(error)) {
              await this.transitionReservation(
                reservation.id,
                BookingReservationStatus.PROCESSING,
                BookingReservationStatus.FAILED,
                dbSession,
                {
                  refundStatus: RefundStatus.REQUIRED,
                  lastStripeEventId: event.id,
                }
              );

              this._logger.warn('fulfillment.conflict', {
                reservationId: reservation.id,
                reason: 'SLOT_ALREADY_TAKEN',
              });

              await this.handleRefundRequirement(
                reservation.id,
                paymentIntent.id,
                dbSession
              );
            } else {
              throw error;
            }
          }
        }

        if (
          event.type === 'payment_intent.payment_failed' &&
          (reservation.status === BookingReservationStatus.PENDING_PAYMENT ||
            reservation.status === BookingReservationStatus.PROCESSING)
        ) {
          await this.transitionReservation(
            reservation.id,
            reservation.status,
            BookingReservationStatus.FAILED,
            dbSession,
            {
              lastStripeEventId: event.id,
            }
          );
        }

        await this._stripeWebhookEventRepository.markProcessed(event.id, dbSession);
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Stripe webhook processing failed';
      await this._stripeWebhookEventRepository.markFailed(event.id, message);
      throw error;
    } finally {
      await dbSession.endSession();
    }
  }

  private async transitionReservation(
    reservationId: string,
    from: BookingReservationStatus,
    to: BookingReservationStatus,
    session: mongoose.ClientSession,
    extra: {
      sessionId?: string;
      refundStatus?: RefundStatus;
      lastStripeEventId?: string;
    }
  ): Promise<void> {
    const data: {
      status: BookingReservationStatus;
      sessionId?: string | null;
      refundStatus?: RefundStatus;
      lastStripeEventId?: string | null;
    } = {
      status: to,
    };

    if (extra.sessionId !== undefined) {
      data.sessionId = extra.sessionId;
    }

    if (extra.refundStatus !== undefined) {
      data.refundStatus = extra.refundStatus;
    }

    if (extra.lastStripeEventId !== undefined) {
      data.lastStripeEventId = extra.lastStripeEventId;
    }

    const updated = await this._bookingReservationRepository.update(
      reservationId,
      data,
      session
    );

    if (!updated) {
      throw new ConflictError('Booking reservation state transition failed');
    }

    this._logger.info('reservation.state_transition', {
      reservationId,
      from,
      to,
    });
  }

  private async handleRefundRequirement(
    reservationId: string,
    paymentIntentId: string,
    session: mongoose.ClientSession
  ): Promise<void> {
    try {
      await this._paymentService.createRefund({
        paymentIntentId,
        idempotencyKey: `refund:${reservationId}`,
      });

      await this._bookingReservationRepository.update(reservationId, {
        refundStatus: RefundStatus.REFUNDED,
      }, session);

      this._logger.info('refund.triggered', {
        reservationId,
        refundStatus: RefundStatus.REFUNDED,
      });
    } catch (error) {
      await this._bookingReservationRepository.update(reservationId, {
        refundStatus: RefundStatus.PENDING,
      }, session);

      const message =
        error instanceof Error ? error.message : 'Refund trigger failed';

      this._logger.warn('refund.triggered', {
        reservationId,
        refundStatus: RefundStatus.PENDING,
        reason: message,
      });
    }
  }

  private getPaymentIntent(data: unknown): StripePaymentIntentObject | null {
    if (
      typeof data !== 'object' ||
      data === null ||
      !('object' in data) ||
      typeof data.object !== 'object' ||
      data.object === null ||
      !('id' in data.object) ||
      typeof data.object.id !== 'string'
    ) {
      return null;
    }

    return { id: data.object.id };
  }

  private isDuplicateKeyError(error: unknown): error is { code: number } {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
  }
}
