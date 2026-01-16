import { injectable } from 'tsyringe';
import { IStripeWebhookEventRepository } from '../../../domain/interfaces/IStripeWebhookEventRepository';
import { StripeWebhookEventModel } from '../models/payment/StripeWebhookEventModel';

@injectable()
export class StripeWebhookEventRepository implements IStripeWebhookEventRepository {
  async markProcessed(eventId: string): Promise<boolean> {
    try {
      await StripeWebhookEventModel.create({
        eventId,
        processedAt: new Date(),
      });
      return true;
    } catch (error: any) {
      if (error?.code === 11000) {
        return false;
      }
      throw error;
    }
  }
}
