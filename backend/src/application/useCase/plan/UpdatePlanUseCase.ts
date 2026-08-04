import { inject, injectable } from 'tsyringe';
import { IUpdatePlanUseCase } from '../interface/plan/IUpdatePlanUseCase';
import { PlanResponseDTO, UpdatePlanDTO } from '../../dto/PlanDTO';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import { ConflictError } from '../../../core/errors/ConflictError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { PlanMapper } from '../../mapper/PlanMapper';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { PlanEntity } from '../../../domain/entities/PlanEntity';
import type { ISyncPlanStripeCatalogUseCase } from '../interface/plan/ISyncPlanStripeCatalogUseCase';
import { hasPlanPricingChanged, isPaidPlan } from '../../helpers/planBillingHelpers';

@injectable()
export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(
    @inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,

    @inject('ISyncPlanStripeCatalogUseCase')
    private readonly _syncPlanStripeCatalog: ISyncPlanStripeCatalogUseCase,
  ) {}

  async execute(data: UpdatePlanDTO): Promise<PlanResponseDTO> {
    const existingPlan = await this._planRepository.find(data.planId);

    if (!existingPlan) throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);

    const normalizedSlug =
      data.slug !== undefined ? data.slug.trim().toLowerCase() : undefined;

    const normalizedCurrency =
      data.pricing?.currency !== undefined
        ? data.pricing.currency.trim().toUpperCase()
        : undefined;

    if (normalizedSlug !== undefined && normalizedSlug !== existingPlan.slug) {
      const existingSlugPlan = await this._planRepository.findBySlug(normalizedSlug);
      if (existingSlugPlan) {
        throw new ConflictError(ERROR_MESSAGES.PLAN.ALREADY_EXIST);
      }
    }

    const uniqueFeatures =
      data.features !== undefined ? [...new Set(data.features)] : undefined;

    const mergedData: Partial<PlanEntity> = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(normalizedSlug !== undefined ? { slug: normalizedSlug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      ...(uniqueFeatures !== undefined ? { features: uniqueFeatures } : {}),
      ...(data.limits !== undefined
        ? { limits: { ...existingPlan.limits, ...data.limits } }
        : {}),
    };

    if (data.pricing) {
      mergedData.pricing = {
        monthly:
          data.pricing.monthly !== undefined
            ? data.pricing.monthly
            : existingPlan.pricing.monthly,
        yearly:
          data.pricing.yearly !== undefined
            ? data.pricing.yearly
            : existingPlan.pricing.yearly,
        currency:
          normalizedCurrency !== undefined
            ? normalizedCurrency
            : existingPlan.pricing.currency,
      };
    }

    const updatedPlan = await this._planRepository.update(data.planId, mergedData);
    if (!updatedPlan) {
      throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);
    }

    let plan = updatedPlan;

    if (isPaidPlan(updatedPlan)) {
      const pricingChanged = hasPlanPricingChanged(
        existingPlan.pricing,
        data.pricing,
      );

      plan = await this._syncPlanStripeCatalog.execute(data.planId, {
        recreatePrices: pricingChanged,
      });
    }

    return PlanMapper.toCreateResponse(plan);
  }
}
