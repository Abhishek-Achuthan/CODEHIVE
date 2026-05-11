import { CapabilityKey } from '../types/CapabilityKey';
import { RoomRole } from '../types/RoomRole';

/**
 * RoleDefaults — Defines the default set of capabilities for each room role.
 *
 * These are the fallback permissions when no user-specific override is set.
 * The HOST role is a sentinel (all capabilities), but HOST permission checks
 * bypass this map via immutable-allow logic in the PermissionService.
 */
export const RoleDefaults: Record<RoomRole, CapabilityKey[]> = {
  HOST: Object.values(CapabilityKey),

  MODERATOR: [
    CapabilityKey.ROOM_CHAT_READ,
    CapabilityKey.ROOM_CHAT_WRITE,
    CapabilityKey.ROOM_CHAT_DELETE_OWN,
    CapabilityKey.ROOM_NOTES_VIEW,
    CapabilityKey.ROOM_NOTES_EDIT,
    CapabilityKey.ROOM_POLLS_CREATE,
    CapabilityKey.ROOM_POLLS_VOTE,
    CapabilityKey.ROOM_POLLS_CLOSE,
    CapabilityKey.ROOM_WHITEBOARD_VIEW,
    CapabilityKey.ROOM_WHITEBOARD_DRAW,
    CapabilityKey.ROOM_CODE_VIEW,
    CapabilityKey.ROOM_CODE_EDIT,
    CapabilityKey.ROOM_SCREENSHARE_START,
    CapabilityKey.ROOM_PARTICIPANT_MUTE,
    CapabilityKey.ROOM_PARTICIPANT_KICK,
  ],

  PARTICIPANT: [
    CapabilityKey.ROOM_CHAT_READ,
    CapabilityKey.ROOM_CHAT_WRITE,
    CapabilityKey.ROOM_CHAT_DELETE_OWN,
    CapabilityKey.ROOM_NOTES_VIEW,
    CapabilityKey.ROOM_POLLS_VOTE,
    CapabilityKey.ROOM_WHITEBOARD_VIEW,
    CapabilityKey.ROOM_CODE_VIEW,
    CapabilityKey.ROOM_CODE_EDIT,
  ],

  VIEWER: [
    CapabilityKey.ROOM_CHAT_READ,
    CapabilityKey.ROOM_NOTES_VIEW,
    CapabilityKey.ROOM_WHITEBOARD_VIEW,
    CapabilityKey.ROOM_CODE_VIEW,
  ],
};

/**
 * HOST_IMMUTABLE_CAPABILITIES — Capabilities the HOST can never lose, even if
 * an override is accidentally set. This prevents authority lockout.
 */
export const HOST_IMMUTABLE_CAPABILITIES = new Set<CapabilityKey>([
  CapabilityKey.ROOM_MANAGE_PERMISSIONS,
  CapabilityKey.ROOM_MANAGE_SETTINGS,
  CapabilityKey.ROOM_PARTICIPANT_KICK,
  CapabilityKey.ROOM_PARTICIPANT_MUTE,
  CapabilityKey.ROOM_PARTICIPANT_PROMOTE,
]);
