export type FeatureKey =
  | 'chat'
  | 'notes'
  | 'polls'
  | 'whiteboard'
  | 'screen_share'
  | 'code_editor'
  | 'video_audio'
  | 'private_rooms'
  | 'session_booking';

export type LimitKey =
  | 'max_participants'
  | 'max_active_rooms'
  | 'max_session_hours';

export interface PlanView {
  id: string;
  name: string;
  slug: string;
  description?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPayload {
  name: string;
  slug: string;
  description?: string;
  isPublic?: boolean;
  sortOrder?: number;
  features: FeatureKey[];
  limits?: Partial<Record<LimitKey, number>>;
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };
}

export interface UpdatePlanPayload {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  isPublic?: boolean;
  sortOrder?: number;
  features?: FeatureKey[];
  limits?: Partial<Record<LimitKey, number>>;
  pricing?: {
    monthly?: number;
    yearly?: number;
    currency?: string;
  };
}
