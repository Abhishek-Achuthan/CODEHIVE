import {
  BookSessionDTO,
  IBookingReservationResponseDTO,
} from '../../../dto/SessionDTO';

export interface StripeCheckoutResponseDTO {
  reservation: IBookingReservationResponseDTO;
  clientSecret: string;
  paymentIntentId: string;
  expiresAt: string;
}

export interface IBookSessionWithStripeUseCase {
  execute(input: BookSessionDTO): Promise<StripeCheckoutResponseDTO>;
}
