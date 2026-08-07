import { RoomReportEntity } from '../entities/room/RoomReportEntity';

export interface AdminReportListItem {
  id: string;
  room: {
    id: string;
    title: string;
  } | null;
  reporter: {
    id: string;
    name: string;
    email: string;
  } | null;
  reportedUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  reason: string;
  description?: string;
  resolvedBy: string | null;
  status: RoomReportEntity['status'];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminReportListResult {
  data: AdminReportListItem[];
  total: number;
}

export interface IRoomReportRepository {
  create(data: Omit<RoomReportEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<RoomReportEntity>;
  findAllWithDetails(page: number, limit: number): Promise<AdminReportListResult>;
  updateStatus(id: string, status: RoomReportEntity['status'], resolvedBy?: string): Promise<RoomReportEntity | null>;
}
