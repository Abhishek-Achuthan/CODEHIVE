import { inject, injectable } from 'tsyringe';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import type { IStripeSubscriptionWebhookHandler } from '../../../application/ports/payment/IStripeSubscriptionWebhookHandler';
import type { WebhookEvent } from '../../../domain/types/WebhookEvent';
import type { IStripeWebhookEventRepository } from '../../../domain/interfaces/IStripeWebhookEventRepository';
import type { ISubscriptionRepository } from '../../../domain/interfaces/ISubscriptionRepository';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';
import { SubscriptionStatus } from '../../../domain/types/SubscriptionStatus';
import { PlanBillingInterval } from '../../../domain/types/PlanBillingInterval';
import { PlanEntity } from '../../../domain/entities/PlanEntity';
import {
  resolveSubscriptionBillingInterval,
} from '../../../application/helpers/planBillingHelpers';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import type { INotificationService } from '../../../application/ports/notifications/INotificationService';


@injectable()
export class StripeSubscriptionWebhookHandler
  implements IStripeSubscriptionWebhookHandler
{
  constructor(
    @inject('IStripeWebhookEventRepository')
    private readonly _stripeWebhookEventRepository: IStripeWebhookEventRepository,
    @inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
    @inject('INotificationService')
    private readonly _notificationService: INotificationService,
  ) {}


  async handle(rawEvent: WebhookEvent): Promise<void> {
    const event = this._toStripeEvent(rawEvent);

    this._logger.info('subscription_webhook.received', {
      eventId: event.id,
      type: event.type,
    });

    const dbSession = await mongoose.startSession();

    try {
      await dbSession.withTransaction(async () => {
        const beginResult =
          await this._stripeWebhookEventRepository.beginProcessing(
            event.id,
            event.type,
            dbSession,
          );

        if (beginResult === 'processed') {
          this._logger.info('subscription_webhook.duplicate_suppressed', {
            eventId: event.id,
          });
          return;
        }

        if (beginResult === 'processing') {
          return;
        }

        switch (event.type) {
          case 'customer.subscription.created':
            await this._handleSubscriptionCreated(event, dbSession);
            break;

          case 'customer.subscription.updated':
            await this._handleSubscriptionUpdated(event, dbSession);
            break;

          case 'customer.subscription.deleted':
            await this._handleSubscriptionDeleted(event, dbSession);
            break;

          case 'invoice.payment_failed':
            await this._handleInvoicePaymentFailed(event, dbSession);
            break;

          default:
            break;
        }

        await this._stripeWebhookEventRepository.markProcessed(
          event.id,
          dbSession,
        );
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.SESSION.WEBHOOK_PROCESSING_FAILED;

      await this._stripeWebhookEventRepository.markFailed(event.id, message);

      this._logger.error('subscription_webhook.failed', {
        eventId: event.id,
        type: event.type,
        error: message,
      });

      throw error;
    } finally {
      await dbSession.endSession();
    }
  }

  private async _handleSubscriptionCreated(
    event: Stripe.Event,
    session: mongoose.ClientSession,
  ): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;
    const { userId, planId } = subscription.metadata;

    if (!userId || !planId) {
      this._logger.warn('subscription_webhook.missing_metadata', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
      });
      return;
    }

    const existingPlan = await this._planRepository.find(planId);
    if (!existingPlan) {
      this._logger.warn('subscription_webhook.plan_not_found', {
        eventId: event.id,
        planId,
      });
      return;
    }

    const existing =
      await this._subscriptionRepository.findByStripeSubscriptionIdWithSession(
        subscription.id,
        session,
      );

    if (existing) {
      this._logger.info('subscription_webhook.created_already_exists', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
      });
      return;
    }

    const firstItem = subscription.items.data[0];
    if (!firstItem) return;

    const stripeCustomerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id;

    const billingInterval = this._resolveBillingInterval(
      existingPlan,
      subscription.metadata.billingInterval,
      firstItem.price.id,
      firstItem.price.recurring?.interval,
    );

    const subscriptionPayload = {
      userId,
      planId,
      billingInterval,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      status: this._mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(firstItem.current_period_start * 1000),
      currentPeriodEnd: new Date(firstItem.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripePriceId: firstItem.price.id,
      ...(subscription.canceled_at
        ? { canceledAt: new Date(subscription.canceled_at * 1000) }
        : {}),
      ...(subscription.ended_at
        ? { expiredAt: new Date(subscription.ended_at * 1000) }
        : {}),
    };

    const existingActiveByUser =
      await this._subscriptionRepository.findActiveByUserIdWithSession(userId, session);

    if (existingActiveByUser) {
      await this._subscriptionRepository.updateWithSession(
        existingActiveByUser.id,
        subscriptionPayload,
        session,
      );

      this._logger.info('subscription_webhook.created_replaced_active', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
        userId,
        previousStripeSubscriptionId: existingActiveByUser.stripeSubscriptionId,
      });
      return;
    }

    await this._subscriptionRepository.createWithSession(subscriptionPayload, session);

    await this._notificationService.notify({
      recipientId: userId,
      type: 'SUCCESS',
      category: 'PAYMENT',
      title: 'Subscription Purchased',
      message: `Your subscription has been successfully purchased and is now active.`,
    });

    this._logger.info('subscription_webhook.created', {
      eventId: event.id,
      stripeSubscriptionId: subscription.id,
      userId,
    });
  }

  private async _handleSubscriptionUpdated(
    event: Stripe.Event,
    session: mongoose.ClientSession,
  ): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;

    const existing =
      await this._subscriptionRepository.findByStripeSubscriptionIdWithSession(
        subscription.id,
        session,
      );

    if (!existing) {
      this._logger.warn('subscription_webhook.updated_not_found', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
      });
      return;
    }

    const firstItem = subscription.items.data[0];
    if (!firstItem) return;

    const incomingPeriodEnd = new Date(firstItem.current_period_end * 1000);

    if (incomingPeriodEnd < existing.currentPeriodEnd) {
      this._logger.warn('subscription_webhook.stale_update_skipped', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
        incomingPeriodEnd: incomingPeriodEnd.toISOString(),
        storedPeriodEnd: existing.currentPeriodEnd.toISOString(),
      });
      return;
    }

    const plan = await this._planRepository.find(existing.planId);
    const billingInterval = plan
      ? this._resolveBillingInterval(
          plan,
          subscription.metadata.billingInterval,
          firstItem.price.id,
          firstItem.price.recurring?.interval,
        )
      : existing.billingInterval;

    await this._subscriptionRepository.updateWithSession(
      existing.id,
      {
        status: this._mapStripeStatus(subscription.status),
        billingInterval,
        currentPeriodStart: new Date(firstItem.current_period_start * 1000),
        currentPeriodEnd: incomingPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        stripePriceId: firstItem.price.id,
        ...(subscription.canceled_at
          ? { canceledAt: new Date(subscription.canceled_at * 1000) }
          : {}),
        ...(subscription.ended_at
          ? { expiredAt: new Date(subscription.ended_at * 1000) }
          : {}),
      },
      session,
    );

    this._logger.info('subscription_webhook.updated', {
      eventId: event.id,
      stripeSubscriptionId: subscription.id,
    });
  }

  private async _handleSubscriptionDeleted(
    event: Stripe.Event,
    session: mongoose.ClientSession,
  ): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;

    const existing =
      await this._subscriptionRepository.findByStripeSubscriptionIdWithSession(
        subscription.id,
        session,
      );

    if (!existing) {
      this._logger.warn('subscription_webhook.deleted_not_found', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
      });
      return;
    }

    if (existing.status === SubscriptionStatus.CANCELED) {
      this._logger.info('subscription_webhook.already_canceled', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
      });
      return;
    }

    await this._subscriptionRepository.updateWithSession(
      existing.id,
      {
        status: SubscriptionStatus.CANCELED,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : new Date(),
        expiredAt: subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : new Date(),
      },
      session,
    );

    this._logger.info('subscription_webhook.deleted', {
      eventId: event.id,
      stripeSubscriptionId: subscription.id,
    });
  }

  private async _handleInvoicePaymentFailed(
    event: Stripe.Event,
    session: mongoose.ClientSession,
  ): Promise<void> {
    const invoice = event.data.object as Stripe.Invoice;

    const subscriptionRef =
      invoice.parent?.subscription_details?.subscription;
    if (!subscriptionRef) return;

    const subscriptionId =
      typeof subscriptionRef === 'string'
        ? subscriptionRef
        : subscriptionRef.id;

    const existing =
      await this._subscriptionRepository.findByStripeSubscriptionIdWithSession(
        subscriptionId,
        session,
      );

    if (!existing) {
      this._logger.warn('subscription_webhook.invoice_failed_not_found', {
        eventId: event.id,
        stripeSubscriptionId: subscriptionId,
      });
      return;
    }

    if (
      existing.status === SubscriptionStatus.CANCELED ||
      existing.status === SubscriptionStatus.EXPIRED
    ) {
      return;
    }

    await this._subscriptionRepository.updateWithSession(
      existing.id,
      { status: SubscriptionStatus.PAST_DUE },
      session,
    );

    this._logger.info('subscription_webhook.invoice_payment_failed', {
      eventId: event.id,
      stripeSubscriptionId: subscriptionId,
    });
  }


  private _resolveBillingInterval(
    plan: PlanEntity,
    metadataInterval: string | undefined,
    stripePriceId: string,
    stripeRecurringInterval?: string,
  ): PlanBillingInterval {
    if (metadataInterval === 'monthly' || metadataInterval === 'yearly') {
      return metadataInterval;
    }

    return resolveSubscriptionBillingInterval(
      plan,
      undefined,
      stripePriceId,
      stripeRecurringInterval,
    );
  }

  private _mapStripeStatus(
    status: Stripe.Subscription.Status,
  ): SubscriptionStatus {
    switch (status) {
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'trialing':
        return SubscriptionStatus.TRIALING;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      case 'canceled':
        return SubscriptionStatus.CANCELED;
      case 'unpaid':
        return SubscriptionStatus.CANCELED;
      case 'incomplete':
        return SubscriptionStatus.PAST_DUE;
      case 'incomplete_expired':
        return SubscriptionStatus.EXPIRED;
      default:
        return SubscriptionStatus.PAST_DUE;
    }
  }

  private _toStripeEvent(event: WebhookEvent): Stripe.Event {
    return {
      id: event.id,
      object: 'event' as const,
      type: event.type,
      data: event.data as unknown as Stripe.Event.Data,
      api_version: null,
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      pending_webhooks: 0,
      request: null,
    } as unknown as Stripe.Event;
  }
}
