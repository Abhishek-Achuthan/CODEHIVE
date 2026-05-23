import { FeatureKey } from '../types/FeatureKey';
import { LimitKey } from '../types/LimitKey';

export interface PlanPricing {
  monthly: number;

  yearly: number;

  currency: string;
}

export interface PlanStripeMetadata {
  productId?: string;

  monthlyPriceId?: string;

  yearlyPriceId?: string;
}

export interface PlanEntity {
  id: string;

  name: string;

  slug: string;

  description?: string;

  isActive: boolean;

  isPublic: boolean;

  sortOrder: number;

  features: FeatureKey[];

  limits: Partial<Record<LimitKey, number>>;

  pricing: PlanPricing;

  stripe?: PlanStripeMetadata | undefined;

  createdAt: Date;

  updatedAt: Date;
}