export enum CapabilityKey {
  // ── Chat ─────────────────────────────────────────────
  ROOM_CHAT_READ = 'room.chat.read',
  ROOM_CHAT_WRITE = 'room.chat.write',
  ROOM_CHAT_DELETE_OWN = 'room.chat.delete_own',

  // ── Notes (public) ───────────────────────────────────
  ROOM_PUBLIC_NOTES_VIEW = 'room.public_notes.view',
  ROOM_PUBLIC_NOTES_EDIT = 'room.public_notes.edit',

  // ── Notes (private) ──────────────────────────────────
  ROOM_PRIVATE_NOTES_VIEW = 'room.private_notes.view',
  ROOM_PRIVATE_NOTES_EDIT = 'room.private_notes.edit',

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

  // ── Moderation 
  ROOM_PARTICIPANT_MUTE = 'room.participant.mute',
  ROOM_PARTICIPANT_KICK = 'room.participant.kick',
  ROOM_PARTICIPANT_PROMOTE = 'room.participant.promote',

  // ── Room Management 
  ROOM_MANAGE_PERMISSIONS = 'room.manage.permissions',
  ROOM_MANAGE_SETTINGS = 'room.manage.settings',
}
