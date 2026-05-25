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
    const existing = await StripeWebhookEventModel.findOneAndUpdate(
      { eventId },
      {
        $setOnInsert: {
          eventId,
          type,
          status: StripeWebhookProcessingStatus.PROCESSING,
          lastError: null,
          processedAt: null,
        },
      },
      {
        upsert: true,
        new: false,
        session,
      }
    );

    if (!existing) {
      return 'new';
    }

    if (existing.status === StripeWebhookProcessingStatus.PROCESSED) {
      return 'processed';
    }

    if (existing.status === StripeWebhookProcessingStatus.FAILED) {
      const retried = await StripeWebhookEventModel.findOneAndUpdate(
        {
          eventId,
          status: StripeWebhookProcessingStatus.FAILED,
        },
        {
          $set: {
            status: StripeWebhookProcessingStatus.PROCESSING,
            lastError: null,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (retried) {
        return 'new';
      }

      return 'processing';
    }

    return 'processing';
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
