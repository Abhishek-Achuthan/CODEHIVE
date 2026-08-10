import type {
  CapabilityKey,
  FeatureKey,
  JoinRoomSnapshotResponse,
  RoomFeatureSnapshotResponse,
  RoomLifecycleStatus,
} from "../../../shared/types/api/room";

export interface RoomAuthorizationState {
  snapshot: JoinRoomSnapshotResponse | null;
  lifecycleStatus: RoomLifecycleStatus | null;
  featureSnapshot: RoomFeatureSnapshotResponse | null;
  capabilities: Partial<Record<CapabilityKey, boolean>>;
  enabledFeatures: Set<FeatureKey>;
  hasCapability: (capability: CapabilityKey) => boolean;
  hasFeature: (feature: FeatureKey) => boolean;
  isActive: boolean;
  isReadonly: boolean;
  isArchived: boolean;
  isScheduled: boolean;
  isPurged: boolean;
  isWriteRestricted: boolean;
  canReadChat: boolean;
  canWriteChat: boolean;
  canDeleteOwnChat: boolean;
  canViewNotes: boolean;
  canEditNotes: boolean;
  canEditPublicNotes: boolean;
  canEditPrivateNotes: boolean;
  canViewPolls: boolean;
  canCreatePolls: boolean;
  canVotePolls: boolean;
  canClosePolls: boolean;
  canViewWhiteboard: boolean;
  canEditWhiteboard: boolean;
  canViewCodeEditor: boolean;
  canEditCodeEditor: boolean;
  canRunCode: boolean;
  canStartScreenshare: boolean;
  canManageRoomSettings: boolean;
  canManageRoomPermissions: boolean;
  canModerateParticipants: boolean;
  canUseCodeCollaboration: boolean;
  canUseWhiteboardCollaboration: boolean;
  canUsePublicNoteCollaboration: boolean;
  lifecycleLabel: string;
}

export const buildRoomAuthorization = (
  snapshot: JoinRoomSnapshotResponse | null,
): RoomAuthorizationState => {
  const lifecycleStatus = snapshot?.lifecycleStatus ?? null;
  const featureSnapshot = snapshot?.featureSnapshot ?? null;
  const capabilities = snapshot?.capabilities ?? {};
  const isSessionRoom = !!(
    snapshot?.sessionId ||
    (snapshot as any)?.type === 'SESSION' ||
    featureSnapshot?.planId === 'session_pro' ||
    featureSnapshot?.planName === 'Pro Mentor Session'
  );

  const ALL_SESSION_FEATURES: FeatureKey[] = [
    'chat',
    'notes',
    'polls',
    'whiteboard',
    'screen_share',
    'code_editor',
    'video_audio',
    'private_rooms',
    'session_booking',
  ];

  const enabledFeatures = new Set<FeatureKey>(
    isSessionRoom
      ? ALL_SESSION_FEATURES
      : (featureSnapshot?.enabledFeatures ?? [])
  );

  const hasCapability = (capability: CapabilityKey) =>
    capabilities[capability] === true;
  const hasFeature = (feature: FeatureKey) =>
    isSessionRoom || featureSnapshot === null || enabledFeatures.has(feature);

  const isActive = lifecycleStatus === "ACTIVE";
  const isReadonly = lifecycleStatus === "READONLY";
  const isArchived = lifecycleStatus === "ARCHIVED";
  const isScheduled = lifecycleStatus === "SCHEDULED";
  const isPurged = lifecycleStatus === "PURGED";
  const isWriteRestricted = !isActive;

  const canReadChat = hasFeature("chat") && hasCapability("room.chat.read");
  const canWriteChat = hasFeature("chat") && hasCapability("room.chat.write") && !isWriteRestricted;
  const canDeleteOwnChat =
    hasFeature("chat") && hasCapability("room.chat.delete_own") && !isWriteRestricted;
  const canViewNotes = hasFeature("notes") && (hasCapability("room.public_notes.view") || hasCapability("room.private_notes.view"));
  const canEditNotes = hasFeature("notes") && hasCapability("room.public_notes.edit") && !isWriteRestricted;
  const canEditPublicNotes = hasFeature("notes") && hasCapability("room.public_notes.edit") && !isWriteRestricted;
  const canEditPrivateNotes = hasFeature("notes") && hasCapability("room.private_notes.edit") && !isWriteRestricted;
  const hasPollAccess =
    hasFeature("polls") &&
    (hasCapability("room.polls.create") ||
      hasCapability("room.polls.vote") ||
      hasCapability("room.polls.close"));
  const canCreatePolls =
    hasFeature("polls") && hasCapability("room.polls.create") && !isWriteRestricted;
  const canVotePolls =
    hasFeature("polls") && hasCapability("room.polls.vote") && !isWriteRestricted;
  const canClosePolls =
    hasFeature("polls") && hasCapability("room.polls.close") && !isWriteRestricted;
  const canViewPolls = hasPollAccess;
  const canViewWhiteboard =
    hasFeature("whiteboard") && hasCapability("room.whiteboard.view");
  const canEditWhiteboard =
    hasFeature("whiteboard") && hasCapability("room.whiteboard.draw") && !isWriteRestricted;
  const canViewCodeEditor =
    hasFeature("code_editor") && hasCapability("room.code.view");
  const canEditCodeEditor =
    hasFeature("code_editor") && hasCapability("room.code.edit") && !isWriteRestricted;
  const canRunCode =
    hasFeature("code_editor") && hasCapability("room.code.run") && !isWriteRestricted;
  const canStartScreenshare =
    hasFeature("screen_share") &&
    hasCapability("room.screenshare.start") &&
    !isWriteRestricted;
  const canManageRoomSettings =
    hasCapability("room.manage.settings") && !isWriteRestricted;
  const canManageRoomPermissions =
    hasCapability("room.manage.permissions") && !isWriteRestricted;
  const canModerateParticipants =
    (hasCapability("room.participant.mute") ||
      hasCapability("room.participant.kick") ||
      hasCapability("room.participant.promote")) &&
    !isWriteRestricted;

  const lifecycleLabel = isReadonly
    ? "Read-only room"
    : isArchived
      ? "Archived room"
      : isScheduled
        ? "Scheduled room"
        : isPurged
          ? "Unavailable room"
          : "Live collaboration";

  return {
    snapshot,
    lifecycleStatus,
    featureSnapshot,
    capabilities,
    enabledFeatures,
    hasCapability,
    hasFeature,
    isActive,
    isReadonly,
    isArchived,
    isScheduled,
    isPurged,
    isWriteRestricted,
    canReadChat,
    canWriteChat,
    canDeleteOwnChat,
    canViewNotes,
    canEditNotes,
    canEditPublicNotes,
    canEditPrivateNotes,
    canViewPolls,
    canCreatePolls,
    canVotePolls,
    canClosePolls,
    canViewWhiteboard,
    canEditWhiteboard,
    canViewCodeEditor,
    canEditCodeEditor,
    canRunCode,
    canStartScreenshare,
    canManageRoomSettings,
    canManageRoomPermissions,
    canModerateParticipants,
    canUseCodeCollaboration: canEditCodeEditor,
    canUseWhiteboardCollaboration: canViewWhiteboard,
    canUsePublicNoteCollaboration: canEditPublicNotes,
    lifecycleLabel,
  };
};
