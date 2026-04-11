import { RoomType } from '../../types/RoomType';
import { RoomVisibility } from '../../types/RoomVisisblity';

export interface RoomEntity {
  id: string;

  title: string;
  description?: string;

  hostId: string;

  type: RoomType;
  visibility: RoomVisibility;

  maxParticipants: number;

  participantCount: number;

  createdAt: Date;
  updatedAt: Date;
}