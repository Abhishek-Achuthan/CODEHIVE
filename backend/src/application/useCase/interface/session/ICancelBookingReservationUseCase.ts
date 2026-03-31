export interface ICancelBookingReservationUseCase {
  execute(reservationId: string, userId: string): Promise<boolean>;
}
