import { inject, injectable } from 'tsyringe';
import { IGetBookingReservationStatusUseCase } from '../interface/session/IGetBookingReservationStatusUseCase';
import type { IBookingReservationRepository } from '../../../domain/interfaces/IBookingReservationRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { SessionMapper } from '../../mapper/SessionMapper';
import type { IBookingReservationResponseDTO } from '../../dto/SessionDTO';
import { BookingReservationStatus } from '../../../domain/types/BookingReservationStatus';

@injectable()
export class GetBookingReservationStatusUseCase
  implements IGetBookingReservationStatusUseCase
{
  constructor(
    @inject('IBookingReservationRepository')
    private readonly _bookingReservationRepository: IBookingReservationRepository
  ) {}

  async execute(
    reservationId: string,
    userId: string
  ): Promise<IBookingReservationResponseDTO> {
    const reservation =
      await this._bookingReservationRepository.findByIdAndUser(
        reservationId,
        userId
      );

    if (!reservation) {
      throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);
    }

    if (
      reservation.status === BookingReservationStatus.PENDING_PAYMENT &&
      reservation.expiresAt.getTime() <= Date.now()
    ) {
      const expired = await this._bookingReservationRepository.update(
        reservation.id,
        {
          status: BookingReservationStatus.EXPIRED,
        }
      );

      if (expired) {
        return SessionMapper.toBookingReservationResponse(expired);
      }
    }

    return SessionMapper.toBookingReservationResponse(reservation);
  }
}
