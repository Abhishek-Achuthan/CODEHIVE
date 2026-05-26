import { PlanEntity } from '../../../../domain/entities/PlanEntity';

export interface SyncPlanStripeCatalogOptions {
  recreatePrices?: boolean;
}

export interface ISyncPlanStripeCatalogUseCase {
  execute(
    planId: string,
    options?: SyncPlanStripeCatalogOptions,
  ): Promise<PlanEntity>;
}
