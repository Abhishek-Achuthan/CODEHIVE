import { BookSessionDTO, ISessionResponseDTO } from '../../../dto/SessionDTO';

export interface StripeCheckoutResponseDTO {
  session: ISessionResponseDTO;
  clientSecret: string;
  paymentIntentId: string;
}

export interface IBookSessionWithStripeUseCase {
  execute(input: BookSessionDTO): Promise<StripeCheckoutResponseDTO>;
}
