import { RoomReportEntity } from '../entities/room/RoomReportEntity';

export interface IRoomReportRepository {
  create(data: Omit<RoomReportEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<RoomReportEntity>;
  findAllWithDetails(page: number, limit: number): Promise<{ data: any[]; total: number }>;
  updateStatus(id: string, status: RoomReportEntity['status'], resolvedBy?: string): Promise<RoomReportEntity | null>;
}
