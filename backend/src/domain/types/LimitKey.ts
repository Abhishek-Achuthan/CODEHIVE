/**
 * LimitKey — Represents a quantitative limit that can be configured per
 * subscription plan. Stored in the Plan and snapshotted into the Room.
 */
export enum LimitKey {
  MAX_PARTICIPANTS = 'max_participants',
  MAX_ACTIVE_ROOMS = 'max_active_rooms',
  MAX_SESSION_HOURS = 'max_session_hours',
}
