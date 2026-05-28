export interface InvitePreviewResponse {
  roomId: string;
  title: string;
  hostName: string;
  isFull: boolean;
  canJoin: boolean;
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
  lifecycleStatus: string;
  featureSnapshot: unknown;
  onlineUserIds?: string[];
}
