import { CapabilityKey } from '../types/CapabilityKey';
import { FeatureKey } from '../types/FeatureKey';

/**
 * FeatureCapabilityMap — Links high-level features (plan-level) to the granular
 * capabilities they unlock (permission-level).
 *
 * The PermissionService uses this map to:
 *   1. Determine which capabilities are gated behind a disabled feature.
 *   2. Avoid duplicated logic in individual use cases.
 *
 * If a feature is NOT in the room's featureSnapshot.enabledFeatures, ALL of its
 * associated capabilities are automatically denied, regardless of role or override.
 */
export const FeatureCapabilityMap: Record<FeatureKey, CapabilityKey[]> = {
  [FeatureKey.CHAT]: [
    CapabilityKey.ROOM_CHAT_READ,
    CapabilityKey.ROOM_CHAT_WRITE,
    CapabilityKey.ROOM_CHAT_DELETE_OWN,
  ],
  [FeatureKey.NOTES]: [
    CapabilityKey.ROOM_NOTES_VIEW,
    CapabilityKey.ROOM_NOTES_EDIT,
  ],
  [FeatureKey.POLLS]: [
    CapabilityKey.ROOM_POLLS_CREATE,
    CapabilityKey.ROOM_POLLS_VOTE,
    CapabilityKey.ROOM_POLLS_CLOSE,
  ],
  [FeatureKey.WHITEBOARD]: [
    CapabilityKey.ROOM_WHITEBOARD_VIEW,
    CapabilityKey.ROOM_WHITEBOARD_DRAW,
    CapabilityKey.ROOM_WHITEBOARD_CLEAR,
  ],
  [FeatureKey.CODE_EDITOR]: [
    CapabilityKey.ROOM_CODE_VIEW,
    CapabilityKey.ROOM_CODE_EDIT,
    CapabilityKey.ROOM_CODE_RUN,
  ],
  [FeatureKey.SCREEN_SHARE]: [
    CapabilityKey.ROOM_SCREENSHARE_START,
  ],

  // Moderation and room-management capabilities are gated behind VIDEO_AUDIO
  // because meaningful moderation only exists in a live audio/video session.
  // Plans that include VIDEO_AUDIO unlock the full moderation surface.
  [FeatureKey.VIDEO_AUDIO]: [
    CapabilityKey.ROOM_PARTICIPANT_MUTE,
    CapabilityKey.ROOM_PARTICIPANT_KICK,
    CapabilityKey.ROOM_PARTICIPANT_PROMOTE,
    CapabilityKey.ROOM_MANAGE_PERMISSIONS,
    CapabilityKey.ROOM_MANAGE_SETTINGS,
  ],

  // PRIVATE_ROOMS and SESSION_BOOKING are plan-level access gates checked at
  // creation/booking time (not capability-level), so they map to no capabilities.
  [FeatureKey.PRIVATE_ROOMS]: [],
  [FeatureKey.SESSION_BOOKING]: [],
};

/**
 * CapabilityFeatureMap — Reverse lookup: given a capability, find its parent feature.
 * Computed automatically from FeatureCapabilityMap — do not edit manually.
 */
export const CapabilityFeatureMap: Map<CapabilityKey, FeatureKey> = new Map(
  Object.entries(FeatureCapabilityMap).flatMap(([feature, capabilities]) =>
    capabilities.map((cap) => [cap as CapabilityKey, feature as FeatureKey]),
  ),
);
