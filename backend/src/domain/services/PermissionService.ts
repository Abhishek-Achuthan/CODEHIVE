import { injectable } from 'tsyringe';
import { ParticipantEntity } from '../entities/room/ParticipantEntity';
import { RoomFeatureSnapshot } from '../entities/room/RoomEntity';
import { CapabilityKey } from '../types/CapabilityKey';
import { CapabilityFeatureMap } from '../constants/FeatureCapabilityMap';
import { HOST_IMMUTABLE_CAPABILITIES, RoleDefaults } from '../constants/RoleDefaults';

@injectable()
export class PermissionService {

  canPerform(
    participant: ParticipantEntity,
    snapshot: RoomFeatureSnapshot | null,
    capability: CapabilityKey,
  ): boolean {
    const parentFeature = CapabilityFeatureMap.get(capability);
    if (parentFeature && snapshot) {
      const featuresEnabled = snapshot.enabledFeatures ?? [];
      if (!featuresEnabled.includes(parentFeature)) {
        return false;
      }
    }

    if (participant.role === 'HOST' && HOST_IMMUTABLE_CAPABILITIES.has(capability)) return true;

    const override = participant.overrides[capability];

    if (override !== undefined) return override;

    return RoleDefaults[participant.role].includes(capability);
  }

  resolveAll(
    participant: ParticipantEntity,
    snapshot: RoomFeatureSnapshot | null,
  ): Partial<Record<CapabilityKey, boolean>> {
    const result: Partial<Record<CapabilityKey, boolean>> = {};
    for (const cap of Object.values(CapabilityKey)) {
      result[cap] = this.canPerform(participant, snapshot, cap);
    }
    return result;
  }

  assertIsHost(participant: ParticipantEntity): void {
    if (participant.role !== 'HOST') {
      throw new Error('Only the room host can manage participant permissions.');
    }
  }
}
