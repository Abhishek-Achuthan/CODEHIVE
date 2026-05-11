import { FeatureKey } from '../types/FeatureKey';
import { LimitKey } from '../types/LimitKey';

export interface PlanEntity {
  id: string;

  name: string;
  description?: string;

  price: number;
  currency: string;

  /** Whether this plan is available for new subscriptions. */
  isActive: boolean;

  /** The set of features enabled for rooms created under this plan. */
  features: FeatureKey[];

  /**
   * Quantitative limits configured for this plan.
   * Use Partial<> — not all limits need to be set on every plan.
   */
  limits: Partial<Record<LimitKey, number>>;

  createdAt: Date;
  updatedAt: Date;
}
