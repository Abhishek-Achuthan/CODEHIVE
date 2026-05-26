import { inject, injectable } from 'tsyringe';
import { IGetActiveSubscriptionUseCase } from '../interface/subscription/IGetActiveSubscriptionUseCase';
import type { ISubscriptionRepository } from '../../../domain/interfaces/ISubscriptionRepository';
import { SubscriptionResponseDTO } from '../../dto/subscriptionDTO';
import { SubscriptionMapper } from '../../mapper/SubscriptionMapper';

@injectable()
export class GetActiveSubscriptionUseCase implements IGetActiveSubscriptionUseCase {
  constructor(
    @inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(userId: string): Promise<SubscriptionResponseDTO | null> {
    const subscription =
      await this._subscriptionRepository.findActiveByUserId(userId);

    if (!subscription || subscription.currentPeriodEnd <= new Date()) {
      return null;
    }

    return SubscriptionMapper.toResponse(subscription);
  }
}
