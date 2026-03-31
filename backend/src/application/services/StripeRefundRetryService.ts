import { inject, injectable } from 'tsyringe';
import type { IBookingReservationRepository } from '../../domain/interfaces/IBookingReservationRepository';
import type { ILoggerService } from '../ports/logging/ILoggerService';
import type { IPaymentService } from '../ports/payment/IPaymentService';
import { RefundStatus } from '../../domain/types/RefundStatus';

@injectable()
export class StripeRefundRetryService {
  private _timer: NodeJS.Timeout | null = null;
  private _isRunning = false;

  constructor(
    @inject('IBookingReservationRepository')
    private readonly _bookingReservationRepository: IBookingReservationRepository,
    @inject('IPaymentService')
    private readonly _paymentService: IPaymentService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService
  ) {}

  start(): void {
    if (this._timer) {
      return;
    }

    this._timer = setInterval(() => {
      void this.retryPendingRefunds();
    }, 60_000);
  }

  async retryPendingRefunds(): Promise<void> {
    if (this._isRunning) {
      return;
    }

    this._isRunning = true;

    try {
      const reservations =
        await this._bookingReservationRepository.listReservationsNeedingRefund(
          25
        );

      for (const reservation of reservations) {
        if (!reservation.stripePaymentIntentId) {
          continue;
        }

        try {
          await this._paymentService.createRefund({
            paymentIntentId: reservation.stripePaymentIntentId,
            idempotencyKey: `refund:${reservation.id}`,
          });

          await this._bookingReservationRepository.update(reservation.id, {
            refundStatus: RefundStatus.REFUNDED,
          });

          this._logger.info('refund.triggered', {
            reservationId: reservation.id,
            refundStatus: RefundStatus.REFUNDED,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Refund retry failed';

          await this._bookingReservationRepository.update(reservation.id, {
            refundStatus: RefundStatus.PENDING,
          });

          this._logger.warn('refund.triggered', {
            reservationId: reservation.id,
            refundStatus: RefundStatus.PENDING,
            reason: message,
          });
        }
      }
    } finally {
      this._isRunning = false;
    }
  }
}
