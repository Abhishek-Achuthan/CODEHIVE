import { CapabilityKey } from '../types/CapabilityKey';
import { FeatureKey } from '../types/FeatureKey';


export const FeatureCapabilityMap: Record<FeatureKey, CapabilityKey[]> = {
  [FeatureKey.CHAT]: [
    CapabilityKey.ROOM_CHAT_READ,
    CapabilityKey.ROOM_CHAT_WRITE,
    CapabilityKey.ROOM_CHAT_DELETE_OWN,
  ],
  [FeatureKey.NOTES]: [
    CapabilityKey.ROOM_PUBLIC_NOTES_VIEW,
    CapabilityKey.ROOM_PUBLIC_NOTES_EDIT,
    CapabilityKey.ROOM_PRIVATE_NOTES_VIEW,
    CapabilityKey.ROOM_PRIVATE_NOTES_EDIT,
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

  [FeatureKey.VIDEO_AUDIO]: [
    CapabilityKey.ROOM_PARTICIPANT_MUTE,
    CapabilityKey.ROOM_PARTICIPANT_KICK,
  ],

  [FeatureKey.PRIVATE_ROOMS]: [],
  [FeatureKey.SESSION_BOOKING]: [],
};

export const CapabilityFeatureMap: Map<CapabilityKey, FeatureKey> = new Map(
  Object.entries(FeatureCapabilityMap).flatMap(([feature, capabilities]) =>
    capabilities.map((cap) => [cap as CapabilityKey, feature as FeatureKey]),
  ),
);
