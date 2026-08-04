import { inject, injectable } from 'tsyringe';
import type { ICancelBookingReservationUseCase } from '../interface/session/ICancelBookingReservationUseCase';
import type { IBookingReservationRepository } from '../../../domain/interfaces/IBookingReservationRepository';
import type { IPaymentService } from '../../ports/payment/IPaymentService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { BookingReservationStatus } from '../../../domain/types/BookingReservationStatus';

@injectable()
export class CancelBookingReservationUseCase
  implements ICancelBookingReservationUseCase
{
  constructor(
    @inject('IBookingReservationRepository')
    private readonly _bookingReservationRepository: IBookingReservationRepository,
    @inject('IPaymentService')
    private readonly _paymentService: IPaymentService
  ) {}

  async execute(reservationId: string, userId: string): Promise<boolean> {
    const reservation =
      await this._bookingReservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);
    }

    if (reservation.userId !== userId) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.NOT_ALLOWED_TO_CANCEL);
    }

    if (reservation.status !== BookingReservationStatus.PENDING_PAYMENT) {
      throw new BadRequestError(
        ERROR_MESSAGES.SESSION.ONLY_PENDING_RESERVATIONS_CANCELLABLE
      );
    }

    if (reservation.stripePaymentIntentId) {
      await this._paymentService.cancelPaymentIntent(
        reservation.stripePaymentIntentId
      );
    }

    const cancelled = await this._bookingReservationRepository.update(
      reservation.id,
      {
        status: BookingReservationStatus.EXPIRED,
        expiresAt: new Date(),
      }
    );

    if (!cancelled) {
      throw new ConflictError(
        ERROR_MESSAGES.SESSION.BOOKING_RESERVATION_CANCEL_FAILED
      );
    }

    return true;
  }
}
