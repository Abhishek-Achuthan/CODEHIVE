import type { RoomLifecycleStatus } from "../../../shared/types/api/room";
import type { RoomAuthorizationState } from "./roomAuthorization";

const ACCESS_DENIED = "You are not allowed to access this room";

export function formatRoomAccessError(message: string): string {
  if (message === ACCESS_DENIED) {
    return "You cannot join this room right now. It may be scheduled, ended, or archived.";
  }
  if (message.toLowerCase().includes("invite")) {
    return message;
  }
  if (message.toLowerCase().includes("full")) {
    return message;
  }
  return message;
}

export function getLifecycleBannerMessage(
  auth: Pick<
    RoomAuthorizationState,
    "isReadonly" | "isArchived" | "isScheduled" | "isPurged"
  >,
): string | null {
  if (auth.isReadonly) {
    return "This session has ended. The room is read-only — you can review chat and notes, but cannot edit or collaborate.";
  }
  if (auth.isArchived) {
    return "This room is archived. Chat history and notes remain available; interactive tools are disabled.";
  }
  if (auth.isScheduled) {
    return "This session has not started yet. You can view the room, but live collaboration unlocks when the session begins.";
  }
  if (auth.isPurged) {
    return "This room is no longer available.";
  }
  return null;
}

export function getCollaborationLockTitle(
  auth: Pick<
    RoomAuthorizationState,
    "isReadonly" | "isArchived" | "isScheduled" | "isWriteRestricted"
  >,
): string {
  if (auth.isArchived) {
    return "Collaboration ended (archived)";
  }
  if (auth.isReadonly) {
    return "Read-only mode";
  }
  if (auth.isScheduled) {
    return "Session not started yet";
  }
  if (auth.isWriteRestricted) {
    return "Collaboration unavailable";
  }
  return "Collaboration unavailable";
}

export function getCollaborationLockDescription(
  auth: Pick<RoomAuthorizationState, "isReadonly" | "isArchived" | "isScheduled">,
): string {
  if (auth.isArchived) {
    return "This room has been archived. Content is view-only where available.";
  }
  if (auth.isReadonly) {
    return "The session has ended. You can browse existing content but cannot make changes.";
  }
  if (auth.isScheduled) {
    return "Live editing will be enabled when the session becomes active.";
  }
  return "You do not currently have permission to use this feature.";
}

export function getLifecycleTransitionToast(
  status: RoomLifecycleStatus,
): string | null {
  switch (status) {
    case "ACTIVE":
      return "Session is now live — collaboration is enabled.";
    case "READONLY":
      return "Session ended — this room is now read-only.";
    case "ARCHIVED":
      return "This room has been archived.";
    case "SCHEDULED":
      return null;
    default:
      return null;
  }
}

/** Session entry helpers (time-based; room may be SCHEDULED before start). */
export function getSessionRoomPhase(
  startTime: string,
  endTime: string,
): "upcoming" | "waiting" | "live" | "ended" {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const leadMs = 15 * 60 * 1000;

  if (now < start - leadMs) return "upcoming";
  if (now < start) return "waiting";
  if (now <= end) return "live";
  return "ended";
}

export function getSessionJoinLabel(phase: ReturnType<typeof getSessionRoomPhase>): string | null {
  switch (phase) {
    case "waiting":
      return "Open waiting room";
    case "live":
      return "Join room";
    case "ended":
      return "View session room";
    default:
      return null;
  }
}

export function canOpenSessionRoom(
  roomId: string | undefined,
  phase: ReturnType<typeof getSessionRoomPhase>,
): boolean {
  return !!roomId && phase !== "upcoming";
}
