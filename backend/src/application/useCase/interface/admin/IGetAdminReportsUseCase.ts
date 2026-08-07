import { AdminReportListItem } from '../../../../domain/interfaces/IRoomReportRepository';

export interface GetAdminReportsResult {
  data: AdminReportListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface IGetAdminReportsUseCase {
  execute(page: number, limit: number): Promise<GetAdminReportsResult>;
}
