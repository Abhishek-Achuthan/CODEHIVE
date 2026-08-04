import { RoomInviteType } from '../../types/RoomInviteType';

export interface RoomInviteEntity {
  id: string;
  roomId: string;
  codeHash: string;
  createdBy: string;
  type: RoomInviteType;
  sessionId?: string;
  expiresAt?: Date;
  maxUses?: number;
  useCount: number;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
