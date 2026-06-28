export interface RoomReportEntity {
  id: string;
  roomId: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
