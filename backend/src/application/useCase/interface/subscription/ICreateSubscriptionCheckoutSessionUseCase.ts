import {
  CreateSubscriptionCheckoutSessionDTO,
  SubscriptionCheckoutSessionResponseDTO,
} from '../../../dto/subscriptionDTO';

export interface ICreateSubscriptionCheckoutSessionUseCase {
  execute(
    data: CreateSubscriptionCheckoutSessionDTO,
  ): Promise<SubscriptionCheckoutSessionResponseDTO>;
}