import { CapabilityKey } from '../types/CapabilityKey';
import { RoomRole } from '../types/RoomRole';

export const RoleDefaults: Record<RoomRole, CapabilityKey[]> = {
  HOST: Object.values(CapabilityKey),

  PARTICIPANT: [
    CapabilityKey.ROOM_CHAT_READ,
    CapabilityKey.ROOM_CHAT_WRITE,
    CapabilityKey.ROOM_CHAT_DELETE_OWN,
    CapabilityKey.ROOM_PUBLIC_NOTES_VIEW,
    CapabilityKey.ROOM_PRIVATE_NOTES_VIEW,
    CapabilityKey.ROOM_PRIVATE_NOTES_EDIT,
    CapabilityKey.ROOM_POLLS_VOTE,
    CapabilityKey.ROOM_WHITEBOARD_VIEW,
    CapabilityKey.ROOM_CODE_VIEW,
    CapabilityKey.ROOM_CODE_EDIT,
    CapabilityKey.ROOM_CODE_RUN,
  ],

  VIEWER: [
    CapabilityKey.ROOM_CHAT_READ,
    CapabilityKey.ROOM_PUBLIC_NOTES_VIEW,
    CapabilityKey.ROOM_PRIVATE_NOTES_VIEW,
    CapabilityKey.ROOM_PRIVATE_NOTES_EDIT,
    CapabilityKey.ROOM_WHITEBOARD_VIEW,
    CapabilityKey.ROOM_CODE_VIEW,
  ],
};

export const HOST_IMMUTABLE_CAPABILITIES = new Set<CapabilityKey>([
  CapabilityKey.ROOM_MANAGE_PERMISSIONS,
  CapabilityKey.ROOM_MANAGE_SETTINGS,
  CapabilityKey.ROOM_PARTICIPANT_KICK,
  CapabilityKey.ROOM_PARTICIPANT_MUTE,
  CapabilityKey.ROOM_PARTICIPANT_PROMOTE,
]);
