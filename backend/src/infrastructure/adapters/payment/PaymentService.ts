import { IPaymentService } from '../../../application/ports/payment/IPaymentService';
import { IBillingCatalogService } from '../../../application/ports/payment/IBillingCatalogService';
import {
  BillingCatalogSnapshot,
  CreateBillingPriceInput,
  CreateBillingPriceResult,
  CreateBillingProductInput,
  CreateBillingProductResult,
  UpdateBillingProductInput,
} from '../../../domain/types/BillingCatalogTypes';
import Stripe from 'stripe';
import { env } from '../../../config/envConfig';
import { CreatePaymentIntentInput } from '../../../domain/types/CreatePaymentIntentInput';
import { CreatePaymentIntentResult } from '../../../domain/types/CreatePaymentIntentResult';
import { CreateRefundInput } from '../../../domain/types/CreateRefundInput';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { CreateSubscriptionCheckoutSessionInput } from '../../../domain/types/CreateSubscriptionCheckoutSessionInput';
import { CreateSubscriptionCheckoutSessionResult } from '../../../domain/types/CreateSubscriptionCheckoutSessionResult';

export class PaymentService implements IPaymentService, IBillingCatalogService {
  private _stripeInstance: Stripe | null = null;

  private get _stripe(): Stripe {
    if (!this._stripeInstance) {
      this._stripeInstance = new Stripe(env.stripeSKY);
    }
    return this._stripeInstance;
  }

  async createPaymentIntent(
    input: CreatePaymentIntentInput,
  ): Promise<CreatePaymentIntentResult> {
    const intent = await this._stripe.paymentIntents.create(
      {
        amount: input.amount * 100,
        currency: input.currency,
        metadata: input.metadata,
      },
      {
        idempotencyKey: input.idempotencyKey,
      },
    );

    if (!intent.client_secret) {
      throw new Error(ERROR_MESSAGES.PAYMENT.PAYMENT_INTENT_CREATE_FAILED);
    }

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  }

  async createRefund(input: CreateRefundInput): Promise<void> {
    await this._stripe.refunds.create(
      {
        payment_intent: input.paymentIntentId,
      },
      {
        idempotencyKey: input.idempotencyKey,
      },
    );
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    await this._stripe.paymentIntents.cancel(paymentIntentId);
  }

  async getPaymentIntentClientSecret(paymentIntentId: string): Promise<string> {
    const intent = await this._stripe.paymentIntents.retrieve(paymentIntentId);

    if (!intent.client_secret) {
      throw new Error(
        ERROR_MESSAGES.PAYMENT.PAYMENT_INTENT_CLIENT_SECRET_FETCH_FAILED,
      );
    }

    return intent.client_secret;
  }

  verifyWebhookSignature(payload: Buffer, signature: string): WebhookEvent {
    const secret = env.stripeWebhookSKY;
    try {
      const event = this._stripe.webhooks.constructEvent(
        payload,
        signature,
        secret,
      );
      return {
        id: event.id,
        type: event.type,
        data: event.data,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
        throw new BadRequestError(
          ERROR_MESSAGES.PAYMENT.INVALID_STRIPE_WEBHOOK_SIGNATURE,
        );
      }

      throw error;
    }
  }

  async createSubscriptionCheckoutSession(
    input: CreateSubscriptionCheckoutSessionInput,
  ): Promise<CreateSubscriptionCheckoutSessionResult> {
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: input.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      client_reference_id: input.userId,
      subscription_data: {
        metadata: input.metadata,
      },
      metadata: input.metadata,
    });

    if (!session.url) {
      throw new Error('Failed to create subscription checkout session URL');
    }

    return {
      id: session.id,
      url: session.url,
    };
  }

  async createBillingProduct(
    input: CreateBillingProductInput,
  ): Promise<CreateBillingProductResult> {
    try {
      const product = await this._stripe.products.create({
        name: input.name,
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        metadata: input.metadata,
      });

      return { productId: product.id };
    } catch (error) {
      throw this._toBillingCatalogError(
        ERROR_MESSAGES.PLAN.STRIPE_PRODUCT_CREATE_FAILED,
        error,
      );
    }
  }

  async updateBillingProduct(
    productId: string,
    input: UpdateBillingProductInput,
  ): Promise<void> {
    await this._stripe.products.update(productId, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
    });
  }

  async createBillingPrice(
    input: CreateBillingPriceInput,
  ): Promise<CreateBillingPriceResult> {
    try {
      const requestOptions = input.idempotencyKey
        ? { idempotencyKey: input.idempotencyKey }
        : undefined;

      const price = await this._stripe.prices.create(
        {
          product: input.productId,
          currency: input.currency,
          unit_amount: input.unitAmountCents,
          recurring: { interval: input.interval },
          ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
        },
        requestOptions,
      );

      return { priceId: price.id };
    } catch (error) {
      throw this._toBillingCatalogError(
        ERROR_MESSAGES.PLAN.STRIPE_PRICE_CREATE_FAILED,
        error,
      );
    }
  }

  private _toBillingCatalogError(
    fallbackMessage: string,
    error: unknown,
  ): Error {
    if (error instanceof Stripe.errors.StripeError) {
      return new Error(`${fallbackMessage}: ${error.message}`);
    }

    if (error instanceof Error && error.message) {
      return error;
    }

    return new Error(fallbackMessage);
  }

  async archiveBillingPrice(priceId: string): Promise<void> {
    await this._stripe.prices.update(priceId, { active: false });
  }

  async isBillingPriceActive(priceId: string): Promise<boolean> {
    const price = await this._stripe.prices.retrieve(priceId);
    return price.active;
  }

  async archiveBillingCatalog(catalog: BillingCatalogSnapshot): Promise<void> {
    const priceIds = [catalog.monthlyPriceId, catalog.yearlyPriceId].filter(
      (priceId): priceId is string => !!priceId,
    );

    await Promise.all(
      priceIds.map((priceId) => this.archiveBillingPrice(priceId)),
    );
  }
}
