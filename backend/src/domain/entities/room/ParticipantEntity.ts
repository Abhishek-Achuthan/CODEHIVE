import { RoomRole } from '../../types/RoomRole';
import { CapabilityKey } from '../../types/CapabilityKey';

export interface ParticipantEntity {
  id: string;

  roomId: string;
  userId: string;

  role: RoomRole;

  overrides: Partial<Record<CapabilityKey, boolean>>;

  joinedAt: Date;
}