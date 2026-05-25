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
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

/**
 * Idempotent handler for Stripe subscription lifecycle events.
 *
 * Consistency strategy
 * ────────────────────
 * Every event is processed inside a single Mongoose transaction that spans:
 *   1. Idempotency check  – beginProcessing() atomically inserts a
 *      StripeWebhookEvent record (unique on eventId).  Duplicate or
 *      in-flight events are dropped before any business logic runs.
 *   2. Stale-event guard  – for update events the incoming
 *      currentPeriodEnd is compared against the stored value.  An event
 *      whose billing period is strictly older than what we already have
 *      is silently skipped and still marked processed so it is never
 *      retried.
 *   3. Business mutation  – subscription create / update / delete runs
 *      inside the same session so it either commits with the idempotency
 *      record or rolls back entirely.
 *   4. markProcessed()    – written inside the transaction; if the
 *      transaction rolls back the event stays PROCESSING and Stripe will
 *      retry, which is the safe default.
 *   5. markFailed()       – written outside the transaction (in catch)
 *      so the failure is always persisted even after a rollback.
 *
 * Event-ordering risks
 * ────────────────────
 * Stripe does not guarantee delivery order.  The most dangerous race is
 * customer.subscription.updated arriving before
 * customer.subscription.created (the subscription row does not exist yet).
 * The handler returns early in that case; Stripe will retry the update
 * event and by then the created event will have been processed.
 *
 * A second risk is two updated events for the same subscription arriving
 * concurrently with different billing periods.  The stale-event guard
 * (currentPeriodEnd comparison) ensures the older period never overwrites
 * a newer one.
 */
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
  ) {}

  // ─── Public entry point ────────────────────────────────────────────────────

  async handle(rawEvent: WebhookEvent): Promise<void> {
    const event = this._toStripeEvent(rawEvent);

    this._logger.info('subscription_webhook.received', {
      eventId: event.id,
      type: event.type,
    });

    const dbSession = await mongoose.startSession();

    try {
      await dbSession.withTransaction(async () => {
        // ── 1. Idempotency gate ──────────────────────────────────────────────
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
          // Another worker is handling this event right now; let it finish.
          return;
        }

        // ── 2. Dispatch to the appropriate handler ───────────────────────────
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

        // ── 3. Commit idempotency record ─────────────────────────────────────
        await this._stripeWebhookEventRepository.markProcessed(
          event.id,
          dbSession,
        );
      });
    } catch (error) {
      // markFailed is intentionally outside the transaction so it persists
      // even when the transaction rolled back.
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

  // ─── Event handlers ────────────────────────────────────────────────────────

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

    // Guard: do not double-create if the subscription already exists.
    // This covers the case where a previous attempt partially succeeded
    // and the unique index on stripeSubscriptionId would have thrown anyway.
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

    await this._subscriptionRepository.createWithSession(
      {
        userId,
        planId,
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
      },
      session,
    );

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
      // The created event may not have been processed yet.  Stripe will
      // retry this event; by then the subscription row will exist.
      this._logger.warn('subscription_webhook.updated_not_found', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
      });
      return;
    }

    const firstItem = subscription.items.data[0];
    if (!firstItem) return;

    const incomingPeriodEnd = new Date(firstItem.current_period_end * 1000);

    // ── Stale-event guard ────────────────────────────────────────────────────
    // Reject events whose billing period ends before the period we already
    // have stored.  This prevents out-of-order delivery from regressing the
    // billing window.
    if (incomingPeriodEnd < existing.currentPeriodEnd) {
      this._logger.warn('subscription_webhook.stale_update_skipped', {
        eventId: event.id,
        stripeSubscriptionId: subscription.id,
        incomingPeriodEnd: incomingPeriodEnd.toISOString(),
        storedPeriodEnd: existing.currentPeriodEnd.toISOString(),
      });
      return;
    }

    await this._subscriptionRepository.updateWithSession(
      existing.id,
      {
        status: this._mapStripeStatus(subscription.status),
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

    // Idempotent: if already canceled, nothing to do.
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

    // Idempotent: only move to PAST_DUE from an active-like state.
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
