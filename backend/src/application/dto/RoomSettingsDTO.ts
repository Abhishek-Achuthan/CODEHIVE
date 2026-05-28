import { RoomVisibility } from '../../domain/types/RoomVisibility';
import { UserRole } from '../../domain/types/UserRole';

export interface RoomHostSummaryDTO {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface RoomSettingsResponseDTO {
  id: string;
  title: string;
  description?: string;
  visibility: RoomVisibility;
  createdAt: string;
  host: RoomHostSummaryDTO;
  isHost: boolean;
  canManageInviteLink: boolean;
  joinUrl?: string;
  hasActiveInvite?: boolean;
}
