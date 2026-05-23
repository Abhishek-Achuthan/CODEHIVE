import { RoomFeatureSnapshot } from '../../domain/entities/room/RoomEntity';
import { ResolvedEntitlements } from '../services/EntitlementsResolutionService';

export class RoomMapper {
  public static toFeatureSnapshot(entitlements: ResolvedEntitlements): RoomFeatureSnapshot {
    return {
      planId: entitlements.plan.id,
      planName: entitlements.plan.name,
      enabledFeatures: [...new Set(entitlements.features)],
      limits: {
        ...entitlements.limits,
      },
    };
  }
}
