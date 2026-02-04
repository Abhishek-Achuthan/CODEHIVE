import { RoomRole } from './RoomRole';

export interface RoomParticipant {
  userId: string;
  role: RoomRole;
  joinedAt?: Date;
  leftAt?: Date;
}
