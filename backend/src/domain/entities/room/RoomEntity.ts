import { RoomType } from '../../types/RoomType';
import { RoomVisibility } from '../../types/RoomVisisblity';
import { FeatureKey } from '../../types/FeatureKey';
import { LimitKey } from '../../types/LimitKey';

/**
 * RoomFeatureSnapshot — An immutable snapshot of the host's subscription plan
 * taken at room creation. Governs which features are available for the life of
 * the room, regardless of subsequent plan changes.
 */
export interface RoomFeatureSnapshot {
  planId: string;
  planName: string;
  enabledFeatures: FeatureKey[];
  limits: Partial<Record<LimitKey, number>>;
}

export interface RoomEntity {
  id: string;

  title: string;
  description?: string;

  hostId: string;

  type: RoomType;
  visibility: RoomVisibility;

  maxParticipants: number;
  participantCount: number;

  /**
   * Snapshot of the plan active at room creation.
   * Null for rooms created before subscription system was introduced.
   */
  featureSnapshot: RoomFeatureSnapshot | null;

  createdAt: Date;
  updatedAt: Date;
}