import { randomUUID } from 'crypto';
import { inject, injectable } from 'tsyringe';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import type { IBillingCatalogService } from '../../ports/payment/IBillingCatalogService';
import {
  ISyncPlanStripeCatalogUseCase,
  SyncPlanStripeCatalogOptions,
} from '../interface/plan/ISyncPlanStripeCatalogUseCase';
import { PlanEntity } from '../../../domain/entities/PlanEntity';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { InternalServerError } from '../../../core/errors/InternalServerError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import {
  isPaidPlan,
  toStripeCurrency,
  toStripeUnitAmount,
} from '../../helpers/planBillingHelpers';
import { BillingCatalogSnapshot } from '../../../domain/types/BillingCatalogTypes';
import { isStripeBillingCurrency } from '../../../shared/constants/stripeBillingCurrencies';

@injectable()
export class SyncPlanStripeCatalogUseCase implements ISyncPlanStripeCatalogUseCase {
  constructor(
    @inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,

    @inject('IBillingCatalogService')
    private readonly _billingCatalog: IBillingCatalogService,
  ) {}

  async execute(
    planId: string,
    options?: SyncPlanStripeCatalogOptions,
  ): Promise<PlanEntity> {
    const plan = await this._planRepository.find(planId);

    if (!plan) {
      throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);
    }

    if (!isPaidPlan(plan)) {
      return plan;
    }

    try {
      const stripeCatalog = await this._buildStripeCatalog(plan, options);

      const updatedPlan = await this._planRepository.update(planId, {
        stripe: stripeCatalog,
      });

      if (!updatedPlan) {
        throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);
      }

      return updatedPlan;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      if (error instanceof BadRequestError) {
        throw error;
      }

      const wrapped = new InternalServerError(
        ERROR_MESSAGES.PLAN.STRIPE_CATALOG_SYNC_FAILED,
      );
      if (error instanceof Error && error.stack) {
        wrapped.stack = `${wrapped.stack}\nCaused by: ${error.stack}`;
      }
      throw wrapped;
    }
  }

  private async _buildStripeCatalog(
    plan: PlanEntity,
    options?: SyncPlanStripeCatalogOptions,
  ): Promise<BillingCatalogSnapshot> {
    const metadata = {
      planId: plan.id,
      planSlug: plan.slug,
    };

    let productId = plan.stripe?.productId;

    if (!productId) {
      const product = await this._billingCatalog.createBillingProduct({
        name: plan.name,
        ...(plan.description !== undefined ? { description: plan.description } : {}),
        metadata,
      });
      productId = product.productId;
    } else {
      await this._billingCatalog.updateBillingProduct(productId, {
        name: plan.name,
        ...(plan.description !== undefined ? { description: plan.description } : {}),
        metadata,
      });
    }

    const shouldRecreatePrices =
      options?.recreatePrices === true ||
      !plan.stripe?.productId ||
      (plan.pricing.monthly > 0 && !plan.stripe?.monthlyPriceId) ||
      (plan.pricing.yearly > 0 && !plan.stripe?.yearlyPriceId);

    if (!shouldRecreatePrices) {
      return {
        productId,
        ...(plan.stripe?.monthlyPriceId
          ? { monthlyPriceId: plan.stripe.monthlyPriceId }
          : {}),
        ...(plan.stripe?.yearlyPriceId
          ? { yearlyPriceId: plan.stripe.yearlyPriceId }
          : {}),
      };
    }

    if (plan.stripe) {
      await this._billingCatalog.archiveBillingCatalog({
        productId,
        ...(plan.stripe.monthlyPriceId
          ? { monthlyPriceId: plan.stripe.monthlyPriceId }
          : {}),
        ...(plan.stripe.yearlyPriceId
          ? { yearlyPriceId: plan.stripe.yearlyPriceId }
          : {}),
      });
    }

    const currency = toStripeCurrency(plan.pricing.currency);
    if (!isStripeBillingCurrency(currency)) {
      const hint = currency === 'ind' ? ' Did you mean INR?' : '';
      throw new BadRequestError(
        `Invalid currency code "${plan.pricing.currency}". Please use a Stripe-supported ISO code like USD or INR.${hint}`,
      );
    }
    const catalog: BillingCatalogSnapshot = { productId };
    const hadExistingPrices = !!(plan.stripe?.monthlyPriceId || plan.stripe?.yearlyPriceId);
    const priceNonce = hadExistingPrices ? randomUUID() : 'initial';

    if (plan.pricing.monthly > 0) {
      const monthlyPrice = await this._billingCatalog.createBillingPrice({
        productId,
        unitAmountCents: toStripeUnitAmount(plan.pricing.monthly),
        currency,
        interval: 'month',
        metadata,
        idempotencyKey: `plan-${plan.id}-monthly-${plan.pricing.monthly}-${currency}-${priceNonce}`,
      });
      catalog.monthlyPriceId = monthlyPrice.priceId;
    }

    if (plan.pricing.yearly > 0) {
      const yearlyPrice = await this._billingCatalog.createBillingPrice({
        productId,
        unitAmountCents: toStripeUnitAmount(plan.pricing.yearly),
        currency,
        interval: 'year',
        metadata,
        idempotencyKey: `plan-${plan.id}-yearly-${plan.pricing.yearly}-${currency}-${priceNonce}`,
      });
      catalog.yearlyPriceId = yearlyPrice.priceId;
    }

    return catalog;
  }
}
