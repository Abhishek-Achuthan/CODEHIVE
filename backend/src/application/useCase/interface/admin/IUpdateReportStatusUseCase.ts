import { RoomReportEntity } from '../../../../domain/entities/room/RoomReportEntity';

export interface IUpdateReportStatusUseCase {
  execute(reportId: string, status: RoomReportEntity['status'], adminId?: string): Promise<RoomReportEntity>;
}
