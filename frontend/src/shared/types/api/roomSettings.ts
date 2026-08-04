import type { UserRole } from "../../constants/auth";
import type { RoomVisibility } from "./room";

export interface RoomHostSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface RoomSettingsResponse {
  id: string;
  title: string;
  description?: string;
  visibility: RoomVisibility;
  createdAt: string;
  host: RoomHostSummary;
  isHost: boolean;
  canManageInviteLink: boolean;
  joinUrl?: string;
  hasActiveInvite?: boolean;
}
