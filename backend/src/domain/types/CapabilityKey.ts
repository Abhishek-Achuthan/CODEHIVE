/**
 * CapabilityKey — Represents a granular action a participant can perform inside
 * a room. These are the fine-grained units the PermissionService resolves.
 *
 * Naming convention:  FEATURE_AREA_ACTION
 */
export enum CapabilityKey {
  // ── Chat ─────────────────────────────────────────────
  ROOM_CHAT_READ = 'room.chat.read',
  ROOM_CHAT_WRITE = 'room.chat.write',
  ROOM_CHAT_DELETE_OWN = 'room.chat.delete_own',

  // ── Notes ────────────────────────────────────────────
  ROOM_NOTES_VIEW = 'room.notes.view',
  ROOM_NOTES_EDIT = 'room.notes.edit',

  // ── Polls ────────────────────────────────────────────
  ROOM_POLLS_CREATE = 'room.polls.create',
  ROOM_POLLS_VOTE = 'room.polls.vote',
  ROOM_POLLS_CLOSE = 'room.polls.close',

  // ── Whiteboard ───────────────────────────────────────
  ROOM_WHITEBOARD_VIEW = 'room.whiteboard.view',
  ROOM_WHITEBOARD_DRAW = 'room.whiteboard.draw',
  ROOM_WHITEBOARD_CLEAR = 'room.whiteboard.clear',

  // ── Code Editor ──────────────────────────────────────
  ROOM_CODE_VIEW = 'room.code.view',
  ROOM_CODE_EDIT = 'room.code.edit',
  ROOM_CODE_RUN = 'room.code.run',

  // ── Screen Share ─────────────────────────────────────
  ROOM_SCREENSHARE_START = 'room.screenshare.start',

  // ── Moderation (host/moderator only by role default) ──
  ROOM_PARTICIPANT_MUTE = 'room.participant.mute',
  ROOM_PARTICIPANT_KICK = 'room.participant.kick',
  ROOM_PARTICIPANT_PROMOTE = 'room.participant.promote',

  // ── Room Management (host only by role default) ───────
  ROOM_MANAGE_PERMISSIONS = 'room.manage.permissions',
  ROOM_MANAGE_SETTINGS = 'room.manage.settings',
}
