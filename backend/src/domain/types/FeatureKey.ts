/**
 * FeatureKey — Represents a high-level feature that can be enabled or disabled
 * on a subscription plan. A feature being enabled in the plan means the room
 * *supports* it; actual participant access is governed by CapabilityKey.
 */
export enum FeatureKey {
  CHAT = 'chat',
  NOTES = 'notes',
  POLLS = 'polls',
  WHITEBOARD = 'whiteboard',
  SCREEN_SHARE = 'screen_share',
  CODE_EDITOR = 'code_editor',
  VIDEO_AUDIO = 'video_audio',
  PRIVATE_ROOMS = 'private_rooms',
  SESSION_BOOKING = 'session_booking',
}
