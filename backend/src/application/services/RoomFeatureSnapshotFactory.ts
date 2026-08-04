import { injectable } from 'tsyringe';
import { RoomFeatureSnapshot } from '../../domain/entities/room/RoomEntity';
import { ResolvedEntitlements } from './EntitlementsResolutionService';

@injectable()
export class RoomFeatureSnapshotFactory {

  create(
    entitlements: ResolvedEntitlements,
  ): RoomFeatureSnapshot {

    return {
      planId: entitlements.plan.id,

      planName: entitlements.plan.name,

      enabledFeatures: [
        ...new Set(entitlements.features),
      ],

      limits: {
        ...entitlements.limits,
      },
    };
  }
}