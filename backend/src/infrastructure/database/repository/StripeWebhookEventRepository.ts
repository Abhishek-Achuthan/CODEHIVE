import { ClientSession } from 'mongoose';
import { injectable } from 'tsyringe';
import {
  IStripeWebhookEventRepository,
  StripeWebhookBeginResult,
} from '../../../domain/interfaces/IStripeWebhookEventRepository';
import { StripeWebhookEventModel } from '../models/payment/StripeWebhookEventModel';
import { StripeWebhookProcessingStatus } from '../../../domain/types/StripeWebhookProcessingStatus';

@injectable()
export class StripeWebhookEventRepository
  implements IStripeWebhookEventRepository
{
  async beginProcessing(
    eventId: string,
    type: string,
    session: ClientSession
  ): Promise<StripeWebhookBeginResult> {
    const existing = await StripeWebhookEventModel.findOne({ eventId }).session(
      session
    );

    if (existing) {
      if (existing.status === StripeWebhookProcessingStatus.PROCESSED) {
        return 'processed';
      }

      return 'processing';
    }

    await StripeWebhookEventModel.create(
      [
        {
          eventId,
          type,
          status: StripeWebhookProcessingStatus.PROCESSING,
          lastError: null,
          processedAt: null,
        },
      ],
      { session }
    );

    return 'new';
  }

  async markProcessed(eventId: string, session: ClientSession): Promise<void> {
    await StripeWebhookEventModel.updateOne(
      { eventId },
      {
        $set: {
          status: StripeWebhookProcessingStatus.PROCESSED,
          processedAt: new Date(),
          lastError: null,
        },
      },
      { session }
    );
  }

  async markFailed(eventId: string, errorMessage: string): Promise<void> {
    await StripeWebhookEventModel.updateOne(
      { eventId },
      {
        $set: {
          status: StripeWebhookProcessingStatus.FAILED,
          lastError: errorMessage,
        },
      }
    );
  }
}
