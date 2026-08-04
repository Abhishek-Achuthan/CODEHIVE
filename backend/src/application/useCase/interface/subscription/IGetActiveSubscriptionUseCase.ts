import { CurrentSubscriptionResponseDTO } from '../../../dto/subscriptionDTO';

export interface IGetActiveSubscriptionUseCase {
  execute(userId: string): Promise<CurrentSubscriptionResponseDTO | null>;
}