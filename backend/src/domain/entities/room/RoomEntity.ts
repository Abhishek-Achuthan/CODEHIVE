import { RoomType } from '../../types/RoomType';
import { RoomVisibility } from '../../types/RoomVisibility';
import { FeatureKey } from '../../types/FeatureKey';
import { LimitKey } from '../../types/LimitKey';
import { RoomLifeCycleStatus } from '../../types/RoomLifeCycleStatus';
import { RoomAdmissionPolicy } from '../../types/RoomAdmissionPolicy';


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
  hostName?: string;
  hostAvatarUrl?: string;

  type: RoomType;

  visibility: RoomVisibility;

  maxParticipants: number;

  participantCount: number;

  admissionPolicy: RoomAdmissionPolicy;

  sessionId?: string;

  readonlyAt?: Date;

  archivedAt?: Date;

  purgedAt?: Date;

  lifecycleStatus: RoomLifeCycleStatus

  featureSnapshot: RoomFeatureSnapshot | null;

  createdAt: Date;
  updatedAt: Date;
}
