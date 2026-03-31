import { IBookingReservationResponseDTO } from '../../../dto/SessionDTO';

export interface IGetBookingReservationStatusUseCase {
  execute(
    reservationId: string,
    userId: string
  ): Promise<IBookingReservationResponseDTO>;
}
