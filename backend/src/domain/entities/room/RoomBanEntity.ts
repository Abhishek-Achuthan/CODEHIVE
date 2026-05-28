export interface RoomBanEntity {
  id: string;
  roomId: string;
  userId: string;
  bannedBy: string;
  bannedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
