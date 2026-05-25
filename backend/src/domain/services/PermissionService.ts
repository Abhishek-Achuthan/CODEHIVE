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
    // ── Feature gate (plan-level) ────────────────────────────────────────────
    // If the capability belongs to a feature that is not enabled in the room's
    // snapshot, deny unconditionally — including for the HOST.  The HOST role
    // grants authority over participants, not the ability to bypass the plan.
    const parentFeature = CapabilityFeatureMap.get(capability);
    if (parentFeature && snapshot) {
      const featuresEnabled = snapshot.enabledFeatures ?? [];
      if (!featuresEnabled.includes(parentFeature)) {
        return false;
      }
    }

    // ── HOST immutable capabilities ──────────────────────────────────────────
    // These are moderation/management capabilities that the HOST can never lose
    // via an override.  They are still subject to the feature gate above, so a
    // plan that doesn't include VIDEO_AUDIO will deny mute/kick/promote even
    // for the HOST.
    if (participant.role === 'HOST' && HOST_IMMUTABLE_CAPABILITIES.has(capability)) return true;

    // ── Per-participant override ─────────────────────────────────────────────
    const override = participant.overrides[capability];
    if (override !== undefined) return override;

    // ── Role default ─────────────────────────────────────────────────────────
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
