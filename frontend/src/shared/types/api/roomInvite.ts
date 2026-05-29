import type { RoomLifecycleStatus } from './room';

export interface InvitePreviewResponse {
  roomId: string;
  title: string;
  hostName: string;
  isFull: boolean;
  canJoin: boolean;
  lifecycleStatus?: RoomLifecycleStatus;
}

export interface RoomInviteResponse {
  id: string;
  roomId: string;
  joinUrl: string;
  type: string;
  expiresAt?: string;
  maxUses?: number;
  useCount: number;
  revokedAt?: string;
  createdAt: string;
}

export interface JoinViaInviteSnapshot {
  roomId: string;
  isNewParticipant: boolean;
  participants: Array<{
    userId: string;
    name: string;
    role: string;
    avatarUrl?: string;
  }>;
  messages: unknown[];
  capabilities: Record<string, boolean>;
  lifecycleStatus: RoomLifecycleStatus;
  featureSnapshot: unknown;
  onlineUserIds?: string[];
}
