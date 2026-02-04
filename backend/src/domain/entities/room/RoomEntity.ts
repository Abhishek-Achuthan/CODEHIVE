import { RoomParticipant } from '../../types/RoomParticipant';
import { RoomStatus } from '../../types/RoomStatus';
import { RoomType } from '../../types/RoomType';

export interface RoomEntity {
  id: string;
  type: RoomType;
  ownerId: string;

  sessionId?: string;
  mentorId?: string;

  status: RoomStatus;
  participants: RoomParticipant[];

  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}
