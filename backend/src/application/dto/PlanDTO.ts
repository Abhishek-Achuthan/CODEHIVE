import { FeatureKey } from '../../domain/types/FeatureKey';
import { LimitKey } from '../../domain/types/LimitKey';
import { SubscriptionStatus } from '../../domain/types/SubscriptionStatus';

export interface CreatePlanDTO {
  name: string;
  slug: string;
  description?: string | undefined;
  isPublic?: boolean | undefined;
  sortOrder?: number | undefined;
  features: FeatureKey[];
  limits?: Partial<Record<LimitKey, number>> | undefined;
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };
}

export interface PlanStripeResponseDTO {
  productId?: string;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
}

export interface PlanResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | undefined;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  features: FeatureKey[];
  limits: Partial<Record<LimitKey, number>>;
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  stripe?: PlanStripeResponseDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePlanDTO {
  planId: string;
  name?: string | undefined;
  slug?: string | undefined;
  description?: string | undefined;
  isActive?: boolean | undefined;
  isPublic?: boolean | undefined;
  sortOrder?: number | undefined;
  features?: FeatureKey[] | undefined;
  limits?: Partial<Record<LimitKey, number>> | undefined;
  pricing?: {
    monthly?: number | undefined;
    yearly?: number | undefined;
    currency?: string | undefined;
  } | undefined;
}




export interface ResolveUserEntitlementsResponseDTO {
  plan: {
    id: string;
    name: string;
    slug: string;
  };
  features: FeatureKey[];
  limits: Partial<Record<LimitKey, number>>;
  subscription: {
    isSubscribed: boolean;
    status: SubscriptionStatus;
  };
}




