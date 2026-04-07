import { RoomRole } from "../../types/RoomRole";

export interface ParticipantEntity {
  id: string;

  roomId: string;
  userId: string;

  role: RoomRole;

  joinedAt: Date;
}