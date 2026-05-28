import type { FeatureKey } from '../../../shared/types/api/room';
import type { FeatureLockReason } from '../components/FeatureLockedPanel';
import type { RoomAuthorizationState } from './roomAuthorization';

export function isChatAccessible(auth: RoomAuthorizationState): boolean {
  return auth.canReadChat || auth.canWriteChat;
}

export function isNotesAccessible(auth: RoomAuthorizationState): boolean {
  return auth.canViewNotes;
}

export function isPollsAccessible(auth: RoomAuthorizationState): boolean {
  return auth.canViewPolls;
}

export function isWhiteboardAccessible(auth: RoomAuthorizationState): boolean {
  return auth.canViewWhiteboard || auth.canEditWhiteboard;
}

export function isCodeEditorAccessible(auth: RoomAuthorizationState): boolean {
  return auth.canViewCodeEditor || auth.canEditCodeEditor;
}

export function getFeatureLockReason(
  auth: RoomAuthorizationState,
  feature: FeatureKey,
  isAccessible: boolean,
): FeatureLockReason {
  if (!isAccessible) {
    if (!auth.hasFeature(feature)) {
      return 'upgrade';
    }
    if (auth.isReadonly || auth.isWriteRestricted) {
      return 'readonly';
    }
    return 'permission';
  }
  return 'upgrade';
}
